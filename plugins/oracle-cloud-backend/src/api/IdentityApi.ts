/*
 * Copyright 2024 The Kubin Kloud Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from "@backstage/config";
import { LoggerService } from "@backstage/backend-plugin-api";
import * as identity from "oci-identity";
import { OracleCloudApi, OracleConfig } from "./OracleCloudApi";
import { GetCompartmentResponse, GetTenancyResponse, ListCompartmentsResponse } from "oci-identity/lib/response";

/**
 * Provides Oracle Cloud API endpoint for Identity services
 * @public 
 */
export class IdentityApi extends OracleCloudApi {

    /**
     * Read all tenancy configurations from config file
     * @param config - Root configuration from app-config.*.yaml file
     * @param options - Various options required to complement config
     * @returns A IdentityApi object that contains list of tenancies
     */
    static fromConfig(
        config: Config,
        options: { logger: LoggerService }
    ) {
        const { logger } = options;
        const tenancyList: OracleConfig[] = IdentityApi.fromConfiguration(config, options).tenancyList;
        return new IdentityApi(logger, config, tenancyList);
    }    

    /**
     * Read config file and profile for an Identity API client 
     * @param tenancyName - Name of the tenancy
     * @param profile - Name of the profile for getting the client
     * @returns an instance of {@link IdentityClient} to trigger Identity REST APIs
     * @public
     */
    public async getIdentityClient(
        tenancyName?: string,
        profile?: string,
    ): Promise<identity.IdentityClient> {
        this.logger?.debug(
            `Creating Oracle Cloud REST API client, for Identity services`,
        );

        const { configurationFilePath, defaultProfile } = await this.getTenancyConfiguration(tenancyName);
        const requiredProfile = profile ? profile : defaultProfile;
        const provider = await super.getAuthenticationDetailsProvider(configurationFilePath, requiredProfile);
        const client = new identity.IdentityClient({
            authenticationDetailsProvider: provider
        });
        return client;
    }

    /**
     * Fetch the details of the tenancy configured
     * based on the tenancyId for a certain config file and profile
     * @param tenancyName - Name of the tenancy
     * @param profile - Profile to be used from the config file
     * @returns an instance of {@link GetTenancyResponse} from Identity Responses
     * @public
     */
    public async getTenancy(
        tenancyName?: string, 
        profile?: string
    ): Promise<GetTenancyResponse> {
        this.logger?.debug(
            `Calling Oracle Cloud REST API, for getting ${tenancyName} tenancy details`,
        );

        const apiClient = this.getIdentityClient(tenancyName, profile);
        const tenancyProfileConfig = (await super.getProfileConfigFromTenancy(tenancyName, profile))!;
        const response = await ((await apiClient).getTenancy({
            tenancyId: (tenancyProfileConfig.get("tenancy"))!,
        }));
        return response;
    }

    /**
     * Get the list of compartments in Tenancy
     * @param tenancyName - Name of the tenancy
     * @param profile - Profile to be used
     * @param compartmentName - Name of the compartment to filter with (if any)
     * @returns an instance of {@link ListCompartmentsResponse} with compartment items
     * @public
     */
    public async getCompartmentsInTenancy(
        tenancyName?: string,
        profile?: string,
        compartmentName?: string,
    ): Promise<ListCompartmentsResponse> {
        this.logger?.debug(
            `Calling Oracle Cloud REST API, for getting ${tenancyName} compartment details`,
        );

        const tenancyProfileConfig = (await super.getProfileConfigFromTenancy(tenancyName, profile))!;
        const apiClient = await this.getIdentityClient(tenancyName, profile);

        // Pass tenancy OCID from the config file and profile as compartmentId
        const response = await apiClient.listCompartments({
            compartmentId: (tenancyProfileConfig.get("tenancy"))!,
            name: compartmentName,
        })

        return response;
    }

    /**
     * Get the details of the compartment in a tenancy
     * @param compartmentName - Name of the compartment to get details for
     * @param tenancyName - Name of the tenancy
     * @param profile - Profile to be used
     * @returns an instance of {@link GetCompartmentResponse} with compartment model
     * @public
     */
    public async getCompartmentDetailsInTenancy(
        compartmentName: string,
        tenancyName?: string,
        profile?: string,
    ): Promise<GetCompartmentResponse> {
        this.logger?.debug(
            `Calling Oracle Cloud REST API, for getting ${compartmentName} compartment details`,
        );

        if(!compartmentName){
            throw new Error(
                `No compartment name was provided in the query parameters.`
            )
        }

        const tenancyProfileConfig = (await super.getProfileConfigFromTenancy(tenancyName, profile))!;
        const compartmentList = (await this.getCompartmentsInTenancy(tenancyName, profile, compartmentName)).items;

        // Since each parent compartment will have unique names for child compartments,
        // we can filter the compartment list (parent compartmentId) with tenancy compartmentID 
        // to remove the compartments lower in the hierarchy tree 
        const requiredCompartment = compartmentList.filter(
            compartment => compartment.compartmentId === (tenancyProfileConfig.get("tenancy"))!,
        )
        const apiClient = await this.getIdentityClient(tenancyName, profile);

        if(requiredCompartment.length < 1) {
            throw new Error(
                `No compartment found with name '${compartmentName}' in tenancy '${tenancyName}'`
            )
        }

        if(requiredCompartment.length > 1){
            throw new Error(
                `Multiple compartments found with name '${compartmentName}' in tenancy '${tenancyName}'`
            )
        }

        const response = await apiClient.getCompartment({
            compartmentId: requiredCompartment[0].id,
        })

        return response;

    }
}
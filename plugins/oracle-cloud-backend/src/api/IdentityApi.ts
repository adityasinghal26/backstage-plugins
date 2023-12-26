/*
 * Copyright 2023 The Kubin Kloud Authors
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
import { Logger } from "winston";
import * as identity from "oci-identity";
import { OracleCloudApi, OracleConfig } from "./OracleCloudApi";
import { GetTenancyResponse } from "oci-identity/lib/response";

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
        options: { logger: Logger }
    ) {
        const { logger } = options;
        const tenancyList: OracleConfig[] = IdentityApi.fromConfiguration(config, options).tenancyList;
        return new IdentityApi(logger, config, tenancyList);
    }    

    /**
     * Read config file and profile for an Identity API client 
     * @param tenancyName - Name of the tenancy
     * @param profile - Name of the profile for getting the client
     * @returns an instance of IdentityClient to trigger Identity REST APIs
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
     * @returns an instance of GetTenancyResponse from Identity Responses
     * @public
     */
    public async getTenancy(tenancyName: string, profile?: string): Promise<GetTenancyResponse> {
        this.logger?.debug(
            `Calling Oracle Cloud REST API, for getting ${tenancyName} tenancy details`,
        );

        const apiClient = this.getIdentityClient(tenancyName, profile);
        const tenancyConfiguration = await super.getTenancyConfiguration(tenancyName);
        const requiredProfileName = profile ? profile : tenancyConfiguration.defaultProfile;
        const tenancyProfileConfig = (await super.getProfileConfig(tenancyConfiguration.configurationFilePath, requiredProfileName))!;
        const response = await ((await apiClient).getTenancy({
            tenancyId: (tenancyProfileConfig.get("tenancy"))!,
        }));
        return response;
    }
}
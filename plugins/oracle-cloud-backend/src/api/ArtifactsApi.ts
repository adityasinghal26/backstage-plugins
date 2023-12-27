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
import * as artifacts from "oci-artifacts";
import { OracleCloudApi, OracleConfig } from "./OracleCloudApi";
import { ListContainerRepositoriesResponse } from "oci-artifacts/lib/response";
import { IdentityApi } from "./IdentityApi";

/**
 * Provides Oracle Cloud API endpoint for Artifacts services
 * @public 
 */
export class ArtifactsApi extends OracleCloudApi {

    private readonly identityApi: IdentityApi;

    private constructor(
        logger: Logger,
        config: Config,
        tenancyList: OracleConfig[],
        identityApi: IdentityApi,
    ) {
        super(logger, config, tenancyList);
        this.identityApi = identityApi;
    }

    /**
     * Read all tenancy configurations from config file
     * @param config - Root configuration from app-config.*.yaml file
     * @param options - Various options required to complement config
     * @returns A ArtifactsApi object that contains list of tenancies
     */
    static fromConfig(
        config: Config,
        options: { logger: Logger }
    ) {
        const { logger } = options;
        const tenancyList: OracleConfig[] = ArtifactsApi.fromConfiguration(config, options).tenancyList;
        const identityApi = IdentityApi.fromConfig(config, options);
        return new ArtifactsApi(logger, config, tenancyList, identityApi);
    }

    /**
     * Read config file and profile for an Artifacts API client 
     * @param tenancyName - Name of the tenancy
     * @param profile - Name of the profile for getting the client
     * @returns an instance of ArtifactsClient to trigger Artifacts REST APIs
     * @public
     */
    public async getArtifactsClient(
        tenancyName?: string,
        profile?: string,
    ): Promise<artifacts.ArtifactsClient> {
        this.logger?.debug(
            `Creating Oracle Cloud REST API client, for Artifacts services`,
        );

        const { configurationFilePath, defaultProfile } = await this.getTenancyConfiguration(tenancyName);
        const requiredProfile = profile ? profile : defaultProfile;
        const provider = await super.getAuthenticationDetailsProvider(configurationFilePath, requiredProfile);
        const client = new artifacts.ArtifactsClient({
            authenticationDetailsProvider: provider
        });
        return client;
    }

    /**
     * Fetch the list and the details of the container repositories present
     * based on the compartment name for a certain config file and profile
     * @param compartmentName - Name of the compartment
     * @param tenancyName - Name of the tenancy
     * @param profile - Profile to be used from the config file
     * @returns an instance of GetTenancyResponse from Identity Responses
     * @public
     */
    public async getContainerRepositories(
        compartmentName: string,
        tenancyName?: string,
        profile?: string,
    ): Promise<ListContainerRepositoriesResponse> {
        this.logger?.debug(
            `Calling Oracle Cloud REST API, for getting ${compartmentName} container repositories`,
        );

        if(!compartmentName){
            throw new Error(
                `No compartment name was provided in the query parameters.`
            )
        }

        const apiClient = await this.getArtifactsClient(tenancyName, profile);
        const compartmentDetails = await this.identityApi.getCompartmentDetailsInTenancy(compartmentName, tenancyName, profile);
        const response = await apiClient.listContainerRepositories({
            compartmentId: compartmentDetails.compartment.id,
        });
        return response;
    }

}
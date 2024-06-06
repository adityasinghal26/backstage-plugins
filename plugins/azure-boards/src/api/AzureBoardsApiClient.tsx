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

import { AzureBoardsApi } from './AzureBoardsApi';
import { Logger } from 'winston';
import { UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
    AzureDevOpsCredentialsProvider,
    DefaultAzureDevOpsCredentialsProvider,
    ScmIntegrations,
  } from '@backstage/integration';
import {
    WebApi,
    getHandlerFromToken,
    getPersonalAccessTokenHandler,
} from 'azure-devops-node-api';
// import { AzureDevOpsApi } from '@backstage/plugin-azure-devops-backend';
import { TeamContext, Wiql, WorkItem, WorkItemResult } from './types';

/**
 * An API client for fetching information about
 * Azure Boards implementing azureBoardsApiRef
 * 
 *  @public */
export class AzureBoardsApiClient implements AzureBoardsApi {
    private readonly logger: Logger;
    // private readonly urlReader: UrlReader;
    private readonly config: Config;
    private readonly credentialsProvider: AzureDevOpsCredentialsProvider;
    // private readonly azureDevopsApi: AzureDevOpsApi;

    private constructor(
        logger: Logger,
        // urlReader: UrlReader,
        config: Config,
        credentialsProvider: AzureDevOpsCredentialsProvider,
        // azureDevopsApi: AzureDevOpsApi
    ) {
        this.logger = logger;
        this.config = config;
        // this.urlReader = urlReader;
        this.credentialsProvider = credentialsProvider;
        // this.azureDevopsApi = azureDevopsApi;
    }

    static fromConfig(
    config: Config,
    options: { logger: Logger; urlReader: UrlReader },
    ) {
        const scmIntegrations = ScmIntegrations.fromConfig(config);
        const credentialsProvider =
            DefaultAzureDevOpsCredentialsProvider.fromIntegrations(scmIntegrations);
        // const azureDevOpsApi = AzureDevOpsApi.fromConfig(config, options);
        return new AzureBoardsApiClient(
            options.logger,
            // options.urlReader,
            config,
            credentialsProvider,
            // azureDevOpsApi,
        );
    }   
    
    /**
     * Create a Web API method for triggering Azure DevOps APIs
     * @param host - Azure DevOps Host URL
     * @param org - Azure DevOps Organization name
     * @returns a WebApi object to use various Azure DevOps API clients
     */
    private async getWebApi(host?: string, org?: string): Promise<WebApi> {
    // If no host or org is provided we fall back to the values from the `azureDevOps` config section
    // these may have been setup in the `integrations.azure` config section
    // which is why use them here and not just falling back on them entirely
    const validHost = host ?? this.config.getString('azureDevOps.host');
    const validOrg = org ?? this.config.getString('azureDevOps.organization');
    const url = `https://${validHost}/${encodeURIComponent(validOrg)}`;

    const credentials = await this.credentialsProvider.getCredentials({
        url,
    });

    let authHandler;
    if (!credentials) {
        // No credentials found for the provided host and org in the `integrations.azure` config section
        // use the fall back personal access token from `azureDevOps.token`
        const token = this.config.getString('azureDevOps.token');
        authHandler = getPersonalAccessTokenHandler(token);
    } else {
        authHandler = getHandlerFromToken(credentials.token);
    }

    const webApi = new WebApi(url, authHandler);
    return webApi;
    }

    public async getWorkItemsList(
        ids: number[],
        projectName?: string,
        host?: string,
        org?: string,
    ): Promise<WorkItem[]> {

        this.logger?.debug(
            `Calling Azure DevOps REST API, getting Work Items list by ids`,
          );
      
        const webApi = await this.getWebApi(host,org);
        const client = await webApi.getWorkItemTrackingApi();

        const workItems = await client.getWorkItemsBatch({
            ids, 
        }, projectName);

        return workItems;
    }
    
    public async getWorkItemsByWiql(
        wiql: Wiql,
        teamContext?: TeamContext,
        host?: string,
        org?: string
    ): Promise<WorkItemResult[]> {
        this.logger?.debug(
            `Calling Azure DevOps REST API, getting Work Items by Wiql ${wiql.query}`,
          );
      
        const webApi = await this.getWebApi(host,org);
        const client = await webApi.getWorkItemTrackingApi();
        
        // Get all the work item references based on query given in wiql 
        const { workItems } = await client.queryByWiql(wiql,teamContext);
        
        // Create a list of IDs and fetch all the required work items
        var ids: Array<number> = [];
        workItems?.forEach((item) => {
            ids.push(item.id!);
        })
        const workItemsList: WorkItem[] = await this.getWorkItemsList(ids,teamContext?.project,host,org)
        
        // Create a result array with url and work item object
        // For all elements in workItems references obtained by WiQL, 
        // add the work item object based on IDs
        // var workItemsResultList : Array<WorkItemResult> = [];
        let workItemsResultList = workItems!.map(item => {
            let workItemResult = workItemsList.find(element => element.id === item.id)
            return { ...item, workItemResult }
        })

        return workItemsResultList;
    }
}
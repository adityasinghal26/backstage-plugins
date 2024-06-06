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

import { createApiRef } from '@backstage/core-plugin-api';
import { TeamContext, Wiql, WorkItem, WorkItemResult } from './types';

/** 
 * An API service to use Azure Boards within Backstage
 * 
 * @public
 *  */
export const azureBoardsApiRef = createApiRef<AzureBoardsApi>({
    id: 'plugin.azure-boards.service',
});

/** 
 * A client object for fetching information about Azure Boards
 * 
 * @public */
export type AzureBoardsApi = {

    getWorkItemsList: (
        ids: number[],
        projectName?: string,
        host?: string,
        org?: string,
    )=> Promise<WorkItem[]>

    getWorkItemsByWiql: (wiql: Wiql, teamContext?: TeamContext, host?: string, org?: string) 
        => Promise<WorkItemResult[]> 

}
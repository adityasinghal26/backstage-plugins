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

/**
 * A WIQL query
 */
export interface Wiql {
    /**
     * The text of the WIQL query
     */
    query?: string;
}

/**
 * The Team Context for an operation.
 */
export interface TeamContext {
    /**
     * The team project Id or name.  Ignored if ProjectId is set.
     */
    project?: string;
    /**
     * The Team Project ID.  Required if Project is not set.
     */
    projectId?: string;
    /**
     * The Team Id or name.  Ignored if TeamId is set.
     */
    team?: string;
    /**
     * The Team Id
     */
    teamId?: string;
}

export type WorkItem = {

    /**
     * Work item ID.
     */
    id?: number;

    /**
     * Map of field and values for the work item.
     */
    fields?: {
        [key: string]: any;
    };
}

export type WorkItemResult = {

    /**
     * Work item ID.
     */
    id?: number;
    
    /**
     * Work Item object
     */
    item?: WorkItem;

    /**
     * REST API URL of the resource
     */
    url?: string;
}
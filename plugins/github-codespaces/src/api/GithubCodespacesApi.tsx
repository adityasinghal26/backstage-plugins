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

import { RestEndpointMethodTypes } from '@octokit/rest';
import { createApiRef } from '@backstage/core-plugin-api';

/** 
 * An API service to use Github Codespaces within Backstage
 * 
 * @public
 *  */
export const githubCodespacesApiRef = createApiRef<GithubCodespacesApi>({
    id: 'plugin.github-codespaces.service',
});

/** 
 * A client object for fetching information about Github Codespaces
 * 
 * @public */
export type GithubCodespacesApi = {

    /**
     * Get Github repository details for given Owner and Repo name
     * @param owner - Organisation or user name for the repository 
     * @param repository_name - Name of the repository
     * @returns entire set of repository details
     */
    getRepositoryDetails: (owner: string, repository_name: string) =>
        Promise<
            RestEndpointMethodTypes['repos']['get']['response']['data']
        >

    /**
     * List all the Github Codespaces instances for Authenticated User
     * @returns total_count and an array of Codespaces
     */
    listCodespacesForUser: () => 
        Promise<
            RestEndpointMethodTypes['codespaces']['listForAuthenticatedUser']['response']['data']
        >

    /**
     * List all the Github Codespaces instaces for Authenticated user
     * filtered with the repository to which they belong
     * @param owner - Organisation or user name for the repository
     * @param repository_name - Name of the repository
     * @returns total_count and an array of Codespaces
     */
    listCodespacesInRepoForUser: (owner: string, repository_name: string) =>
        Promise<
            RestEndpointMethodTypes['codespaces']['listInRepositoryForAuthenticatedUser']['response']['data']
        >

    /**
     * Start a given particular codespace instance
     * @param codespaceName - Name of the codespace to start
     * @returns details of the codespace to start
     */
    startCodespaceForUser: (codespaceName: string) => Promise<
        RestEndpointMethodTypes['codespaces']['startForAuthenticatedUser']['response']['data']
    >

    /**
     * Create a new Codespace instance on a given repository
     * @param displayName - Display Name for the codespace
     * @param owner - Organisation or user name for the repository
     * @param repositoryName - Name of the repository
     * @param devcontainerPath - Path to use for Codespace devcontainer
     * @returns details of the codespace to start
     */
    createCodespaceInEntityForUser: (displayName: string, owner: string, repositoryName: string, devcontainerPath?: string) =>
        Promise<
            RestEndpointMethodTypes['codespaces']['createWithRepoForAuthenticatedUser']['response']['data']
        >

    /**
     * Stop a particular running Codespace instance
     * @param name - Name for the codespace
     * @returns void
     */
    stopCodespaceForUser: (name: string) => Promise<void>

};
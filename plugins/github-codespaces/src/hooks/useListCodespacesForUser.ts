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

import { githubCodespacesApiRef } from "../api"; 
import { useApi } from "@backstage/core-plugin-api";
import { RestEndpointMethodTypes } from "@octokit/rest";
import useAsync from "react-use/lib/useAsync";

/**
 * React hook to list all the codespaces for the Authenticated User
 * 
 * @returns the list and details of all the codespaces
 */
export function useListCodespacesForUser(): {
    count?: RestEndpointMethodTypes['codespaces']['listForAuthenticatedUser']['response']['data']['total_count'];
    data?: RestEndpointMethodTypes['codespaces']['listForAuthenticatedUser']['response']['data']['codespaces'];
    loading: boolean;
    error?: Error;
} {
    const api = useApi(githubCodespacesApiRef);

    // trigger an async API call to get the list of codespaces
    // for the authenticated user
    const { value, loading, error } = useAsync(() => {
            return api.listCodespacesForUser();
    }, [api]);

    return {
        count: value?.total_count,
        data: value?.codespaces,
        loading,
        error,
    };
}
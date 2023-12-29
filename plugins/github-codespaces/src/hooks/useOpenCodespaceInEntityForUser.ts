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

import { Entity } from "@backstage/catalog-model";
import { githubCodespacesApiRef } from "../api"; 
import { useApi } from "@backstage/core-plugin-api";
import { getProjectNameFromEntity } from "../utils";
import { useCallback } from "react";

/**
 * React hook to Open the Entity in Github Codespace
 * with Codespace display name same as entity name
 * 
 * @param entity - Entity object
 * @returns Codespace object with the details of the opened codespace
 */
export function useOpenCodespaceInEntityForUser(
    entity: Entity,
) {
    const api = useApi(githubCodespacesApiRef);

    // Verify whether the codespace list contains
    // any codespace which has a substring with entity name
    const verifyCodespaceNameWithEntity = (entityName: string, codespaceName: any) => {
        return (codespaceName.toLowerCase().indexOf(entityName.toLowerCase()) >= 0);
    }

    const startCodespace = useCallback(async() => {
        const entityName = entity.metadata.name;

        // Get the repository owner and name from the project-slug
        // and filter the codespaces for the Authenticated User
        const projectName = getProjectNameFromEntity(entity);
        const [owner, repositoryName] = (projectName ?? '/').split('/');
        const codespacesListInRepo = await api.listCodespacesInRepoForUser(owner, repositoryName); 

        const { codespaces } =  codespacesListInRepo;

        // Create a list of codespaces filtered for the entity name and repository
        const verifiedCodespaces = codespaces.filter((codespace) =>
            verifyCodespaceNameWithEntity(entityName, codespace.display_name)
        )

        const count = verifiedCodespaces.length;

        // TODO handle the logic if in case the filtered codespace count is more than 1
        // TODO this might happen if there exists an entity name 
        // TODO which is substring of other entity 

        // If the number of filtered codespaces is none,
        // trigger an API call to create a new codespace instance on the repository
        // else start the top most existing codespace 
        return (
            (count === 0) ?
            ((await api.createCodespaceInEntityForUser(entityName,owner,repositoryName))) :
            api.startCodespaceForUser(verifiedCodespaces[0].name)
        );
    },[api, entity])

    return { startCodespace };
}

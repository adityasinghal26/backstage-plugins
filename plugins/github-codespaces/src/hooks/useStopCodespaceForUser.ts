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

import { alertApiRef, useApi } from "@backstage/core-plugin-api";
import { githubCodespacesApiRef } from "../api";
import { useCallback } from "react";

export function useStopCodespaceForUser(
    codespace_name: string,
) {
    const api = useApi(githubCodespacesApiRef);
    const alertApi = useApi(alertApiRef)

    const stopCodespace = useCallback(async() => {
        return api.stopCodespaceForUser(codespace_name)
        .then(() => {
            alertApi.post({
                message: 'Codespace stopped',
                severity: 'info',
                display: 'transient',
            })
        }).catch(() => {
            alertApi.post({
                message: 'Codespace stop failed.',
                severity: 'error',
                display: 'transient',
            })
        })
    },[api, alertApi, codespace_name])

    return { stopCodespace };
}
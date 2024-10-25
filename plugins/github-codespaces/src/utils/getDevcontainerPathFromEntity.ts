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

import { Entity } from '@backstage/catalog-model';

/**
 * (Optional) Annotation for the Github Codespaces devcontainer path
 *  @public
 */
export const GITHUB_CODESPACES_DEVCONTAINER_ANNOTATION =
  'github.com/devcontainer-path';

/**
 * Get the devcontainer path from the entity annotations
 * @param entity - Entity object
 * @returns the value of the devcontainer path in the entity defintion annotations
 */
export const getDevcontainerPathFromEntity = (entity: Entity) =>
  entity?.metadata.annotations?.[GITHUB_CODESPACES_DEVCONTAINER_ANNOTATION] ??
  '';

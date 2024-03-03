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

import { alertApiRef, configApiRef, createApiFactory, createPlugin, createRoutableExtension, githubAuthApiRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { githubCodespacesApiRef, GithubCodespacesApiClient } from './api';

export const githubCodespacesPlugin = createPlugin({
  id: 'github-codespaces',
  apis: [
    createApiFactory({
      api: githubCodespacesApiRef,
      deps: { alertApi: alertApiRef, configApi: configApiRef , githubAuthApi: githubAuthApiRef },
      factory: ({ configApi, githubAuthApi }) => new GithubCodespacesApiClient({configApi, githubAuthApi})
    })
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const GithubCodespacesPage = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesPage',
    component: () =>
      import('./components/GithubCodespacesPage').then(m => m.GithubCodespacesPage),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubCodespacesContent = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesContent',
    component: () => 
      import('./components/GithubCodespacesEntityContent').then(m => m.GithubCodespaceEntityContent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubCodespacesRepoContent = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesRepoContent',
    component: () => 
      import('./components/GithubCodespacesEntityContent').then(m => m.GithubCodespaceEntityRepoContent),
    mountPoint: rootRouteRef,
  }),
);

export const GithubCodespacesPageList = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesPageList',
    component: () => 
      import('./components/GithubCodespacesPage').then(m => m.GithubCodespacesPageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubCodespacesCard = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesCard',
    component: () => 
      import('./components/GithubCodespacesEntityCard').then(m => m.GithubCodespacesEntityCard),
    mountPoint: rootRouteRef,
  })
)

export const EntityGithubCodespacesWidget = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesWidget',
    component: () => 
      import('./components/GithubCodespacesEntityCard').then(m => m.GithubCodespacesWidgetCard),
    mountPoint: rootRouteRef,
  })
)
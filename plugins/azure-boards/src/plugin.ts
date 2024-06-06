import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const azureBoardsPlugin = createPlugin({
  id: 'azure-boards',
  routes: {
    root: rootRouteRef,
  },
});

export const AzureBoardsPage = azureBoardsPlugin.provide(
  createRoutableExtension({
    name: 'AzureBoardsPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

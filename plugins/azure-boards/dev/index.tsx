import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { azureBoardsPlugin, AzureBoardsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(azureBoardsPlugin)
  .addPage({
    element: <AzureBoardsPage />,
    title: 'Root Page',
    path: '/azure-boards'
  })
  .render();

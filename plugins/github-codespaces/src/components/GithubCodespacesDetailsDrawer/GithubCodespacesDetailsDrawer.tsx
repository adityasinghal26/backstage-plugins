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

import {
    Button,
    Drawer,
    Grid,
    IconButton,
    Link,
    makeStyles,
    Typography,
  } from '@material-ui/core';
import React from 'react';
import { StructuredMetadataTable } from '@backstage/core-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import MaterialButton from '@material-ui/core/Button';
import { useStopCodespaceForUser } from '../../hooks/useStopCodespaceForUser';
//   import { configApiRef, useApi } from '@backstage/core-plugin-api';
  
  interface TableContent {
    [key: string]: any;
  }
  
  const useStyles = makeStyles({
    paper: {
      padding: '2em',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: '2em',
    },
    button: {
      textTransform: 'none',
      justifyContent: 'flex-start',
      fontWeight: 'bold',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      height: '80%',
    },
  });

  export const DetailsDrawerComponent = (
    rowData: any,
  ) => {
    const classes = useStyles();
    const [state, setState] = React.useState(false);
    // const configApi = useApi(configApiRef);
    // const namespaced =
    //   configApi.getOptionalBoolean('argocd.namespacedApps') ?? false;
  
    const { stopCodespace } = useStopCodespaceForUser(rowData.name);
    const toggleDrawer =
      (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
  
        setState(open);
      };
    const tableContent: TableContent = {
    //   'Codespaces Instance': rowData.display_name,
    //   'Codespaces Instance': rowData.metadata?.instance?.name ?? '',
      // repository: rowData.repository.html_url,
      repository: (
          <Link
            href={`${rowData.repository.html_url}`}
            target="_blank"
            rel="noopener"
          >
            {rowData.repository.html_url}
          </Link>
        ),
    //   repoPath: rowData.spec?.source?.path,
    //   destinationServer: rowData.spec?.destination?.server,
    //   destinationNamespace: rowData.spec?.destination?.namespace,
    //   syncStatus: rowData.status?.sync?.status,
    //   images: rowData.status?.summary?.images,
      open: (
        <MaterialButton
          variant="outlined"
          color="primary"
          size="small"
          title="Open Codespace"
          endIcon={<OpenInNewIcon />}
          target="_blank"
          href={`${rowData.web_url}`}
        //   href={`${baseUrl}/applications/${
        //     namespaced
        //       ? `${rowData.metadata.namespace}/${rowData.metadata.name}`
        //       : rowData.metadata.name
        //   }`}
        >
          Open Codespace
        </MaterialButton>
      ),
      stop: (
        <MaterialButton
          variant="outlined"
          color="primary"
          size="small"
          title="Stop Codespace"
          onClick={() => stopCodespace()}
        //   endIcon={<OpenInNewIcon />}
        //   target="_blank"
          // href={`${rowData.stop_url}`}
        //   href={`${baseUrl}/applications/${
        //     namespaced
        //       ? `${rowData.metadata.namespace}/${rowData.metadata.name}`
        //       : rowData.metadata.name
        //   }`}
        >
          Stop Codespace
        </MaterialButton>
      ),
    };
  
    const drawerContents = () => (
      <>
        <div className={classes.header}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <Typography variant="h5">
                Codespace Name: {rowData.display_name}
              </Typography>
            </Grid>
          </Grid>
          <IconButton
            key="dismiss"
            title="Close the drawer"
            onClick={() => setState(false)}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.content}>
          <StructuredMetadataTable metadata={tableContent} />
        </div>
      </>
    );
    return (
      <React.Fragment>
        <Button
          title={rowData.display_name}
          className={classes.button}
          onClick={toggleDrawer(true)}
        >
          {rowData.display_name}
        </Button>
        <Drawer
          anchor="right"
          classes={{ paper: classes.paper }}
          open={state}
          onClose={toggleDrawer(false)}
        >
          {drawerContents()}
        </Drawer>
      </React.Fragment>
    );
  };
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

import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Card, CardHeader, IconButton, makeStyles } from '@material-ui/core';
import { useOpenCodespaceInEntityForUser } from '../../hooks/useOpenCodespaceInEntityForUser';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '8vw',
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});

/**
 * A Backstage Widget card to create/start the Codespaces for the Authenticated User
 * filtered for the particular entity (with the same display name)
 *
 * @public
 */
export const GithubCodespacesWidgetCard = () => {
  const { entity } = useEntity();
  const classes = useStyles();

  // React callback function to open the entity in Github Codespace
  const { startCodespace } = useOpenCodespaceInEntityForUser(entity);

  // method to open the URL in a new tab
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Card className={classes.gridItemCard}>
      <CardHeader
        title="GitHub Codespaces"
        subheader="Start Codespace (dedicated for the component)"
        action={
          <>
            <IconButton
              aria-label="Start"
              title="Start Codespace"
              onClick={() =>
                startCodespace().then(result => {
                  return openInNewTab(result.web_url);
                })
              }
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          </>
        }
      />
    </Card>
  );
};

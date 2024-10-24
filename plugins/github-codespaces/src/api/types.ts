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

import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';

/**
 * An object to handle the input type for the plugin
 */
export type Options = {
  /**
   * API to get the details of Github Auth
   */
  githubAuthApi: OAuthApi;
  /**
   * API to get the root config details
   */
  configApi: ConfigApi;
};

/**
 * Repository details for the Codespace
 * with the required properties
 */
export type Repository = {
  /**
   * ID of the Github Repository
   */
  id: string;

  /**
   * Name of the Github Repository
   */
  name: string;

  /**
   * Full Name of the Repository with Owner Name
   */
  full_name: string;

  /**
   * HTML URL of the Repository to access it on browser
   */
  html_url: string;
};

/**
 * Git Status of the Codespace
 */
export type GitStatus = {
  /**
   * Number of commits the Codespace is ahead of the reference branch
   */
  ahead?: number;

  /**
   * Number of commits the Codespace is behind of the reference branch
   */
  behind?: number;

  /**
   * Whether the Codespace has any uncommitted changes against reference branch
   */
  has_uncommitted_changes?: boolean;

  /**
   * Name of the reference branch
   */
  ref?: string;
};

/**
 * Required set of properties for Codespace object
 */
export type CodespaceProperties = {
  /**
   * Github ID of the Codespace
   */
  id: number;

  /**
   * Container Name of the Codespace instance
   */
  name: string;

  /**
   * Display name of the Codespace instance
   */
  display_name: string;

  /**
   * Repository details to which the Codespace belongs
   */
  repository: Repository;

  /**
   * Current state of the Codespace
   */
  state: string;

  /**
   * Web URL of the Codespace
   */
  url: string;

  /**
   * API URL to start the Codespace instance
   */
  start_url: string;

  /**
   * API URL to stop the Codespace instance
   */
  stop_url: string;
};

/**
 * Codespace object to handle the response from Octokit APIs
 */
export type Codespace = {
  /**
   * Github ID of the Codespace
   */
  id: number;

  /**
   * Container Name of the Codespace instance
   */
  name: string;

  /**
   * Display name of the Codespace instance
   */
  display_name?: string;

  /**
   * Repository details to which the Codespace belongs
   */
  repository: Repository;

  /**
   * Current Git Status of the Codespace compared to the reference branch
   */
  git_status: GitStatus;

  /**
   * Timestamp when the Codespace was created
   */
  created_at: string;

  /**
   * Timestamp when the Codespace was last updated
   */
  updated_at: string;

  /**
   * Idle time after which the Codespace instance will shutdown
   */
  idle_timeout_minutes?: number;

  /**
   * Current state of the Codespace
   */
  state: CodespaceState;

  /**
   * API URL to start the Codespace instance
   */
  start_url: string;

  /**
   * API URL to stop the Codespace instance
   */
  stop_url: string;

  /**
   * Web URL of the Codespace
   */
  web_url: string;
};

/**
 * List of Codespace objects with total_count number
 */
export type CodespacesList = {
  /**
   * Total number of the codespaces in the list
   */
  total_count: number;

  /**
   * Array of the Codespace object
   */
  codespaces: Codespace[];
};

/**
 * Various states of the Codespace instance
 */
export enum CodespaceState {
  Unknown = 'Unknown',
  Created = 'Created',
  Queued = 'Queued',
  Provisioning = 'Provisioning',
  Available = 'Available',
  Awaiting = 'Awaiting',
  Unavailable = 'Unavailable',
  Deleted = 'Deleted',
  Moved = 'Moved',
  Shutdown = 'Shutdown',
  Archived = 'Archived',
  Starting = 'Starting',
  ShuttingDown = 'ShuttingDown',
  Failed = 'Failed',
  Exporting = 'Exporting',
  Updating = 'Updating',
  Rebuilding = 'Rebuilding',
}

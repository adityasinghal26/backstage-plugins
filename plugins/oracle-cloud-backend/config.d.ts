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

export interface Config {
    /** Optional configurations for the Oracle Cloud plugin */
    oracleCloud?: {
      /**
       * The file path for the Oracle Cloud credentials configurations.
       * Appropriate to configure this option if only one Oracle Cloud Tenancy.
       * @visibility frontend
       */
      configFilePath?: string;
  
      /**
       * The default credentials profile to be used to access the Oracle Cloud.
       * Defaults to "DEFAULT" credentials profile.
       * @visibility frontend
       */
      defaultProfile?: string;
  
      /**
       * The optional Oracle Cloud tenancies.
       * @visibility frontend
       */
      tenancies?: Array<{
        /**
         * The name of the Oracle Cloud tenancy.
         * @visibility frontend
         */
        tenancyName: string;
  
        /**
         * The file path for the Oracle Cloud credentials configurations.
         * Appropriate to configure one config file for each tenancy.
         * @visibility frontend
         */
        configFilePath: string;
  
        /**
         * The default credentials profile to be used to access the Oracle Cloud.
         * Defaults to "DEFAULT" credentials profile.
         * @visibility frontend
         */
        defaultProfile: string;
      }>;
    };
  }
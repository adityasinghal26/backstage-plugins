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

import { LoggerService } from "@backstage/backend-plugin-api";
import * as common from "oci-common";
import { Config } from "@backstage/config";

/**
 * Information about an Oracle Cloud tenancy.
 * @public
 */
export interface OracleConfig {
    /**
     * Name of the tenancy. A tenancy name in configuration and catalog should match.
     */
    tenancyName: string;
    /**
     * Configuration file path to access the tenancy config
     */
    configFilePath: string;
    /**
     * Default profile to access the tenancy from the frontend
     */
    defaultProfile?: string;
  }

/**
 * Holds multiple Oracle Cloud tenancy configurations
 * @public
 */
export class OracleCloudApi {
    /**
     * 
     * @param logger - Object to add different logs to the server 
     * @param config - Backend configuration loaded from app-config.*.yaml
     * @param tenancyList - List of Oracle Cloud tenancies configuration from config file
     * 
     */
    protected readonly logger: LoggerService;
    protected readonly config: Config;
    public readonly tenancyList: OracleConfig[];

    protected constructor(
        logger: LoggerService,
        config: Config,
        tenancyList: OracleConfig[],
    ) {
        this.logger = logger;
        this.config = config;
        this.tenancyList = tenancyList;
    }

    /**
     * Read all tenancy configurations from config file
     * @param config - Root configuration from app-config.*.yaml file
     * @param options - Various options required to complement config
     * @returns A OracleCloudApi object that contains list of tenancies
     */
    static fromConfiguration(
        config: Config,
        options: { logger: LoggerService }
    ) {
        const { logger } = options;
        const DEFAULT_ORACLE_TENANCY_NAME = 'default';
        const DEFAULT_ORACLE_TENANCY_PROFILE = 'DEFAULT';

        const oracleCloudConfig = config.getConfig('oracleCloud');
        
        // Load tenancy configuration list
        // if defaultProfile is not mention, profile is configured as 'DEFAULT'
        const tenancyConfigList = oracleCloudConfig.getOptionalConfigArray('tenancies')?.map(c => ({
            tenancyName: c.getString('tenancyName'),
            configFilePath: c.getString('configFilePath'),
            defaultProfile: (c.getOptionalString('defaultProfile')
                            ? c.getOptionalString('defaultProfile')
                            : DEFAULT_ORACLE_TENANCY_PROFILE)!,
        })) || [];

        // Load default tenancy configurations from top level config
        const defaultTenancyName = DEFAULT_ORACLE_TENANCY_NAME;
        const defaultTenancyConfigFilePath = oracleCloudConfig.getOptionalString('configFilePath');
        const defaultTenancyProfile = (oracleCloudConfig.getOptionalString('defaultProfile')
                                    ? oracleCloudConfig.getOptionalString('defaultProfile')
                                    : DEFAULT_ORACLE_TENANCY_PROFILE)!;

        // Verify there's no tenancy named 'default' in the configured array
        // Throw error if 'default' tenancy name is found both at top and array level
        const checkNamedDefault : Boolean = tenancyConfigList.some(
            x => x.tenancyName === defaultTenancyName,
        )

        if (checkNamedDefault && (defaultTenancyConfigFilePath || defaultTenancyProfile)) {
            throw new Error(
                `Found Oracle Cloud tenancy with name ${defaultTenancyName} at both array level and top level configFilePath or defaultProfile config. Use only one style of config.`,
            );
        }

        // Verify whether top level config is complete or partial
        // Check whether the config is fully present or absent
        const defaultNonePresent = !defaultTenancyConfigFilePath && !defaultTenancyProfile;
        const defaultAllPresent = defaultTenancyConfigFilePath && defaultTenancyProfile;
        if (!(defaultNonePresent || defaultAllPresent)) {
            throw new Error(
                `Found partial default Oracle Cloud config. All (or none) of configFilePath and defaultProfile must be provided.`,
            );
        }

        // Create a default tenancy config if top level config is present
        // Append defaultTenancyConfig to the array tenancyConfigList
        if (defaultAllPresent) {
            const defaultTenancyConfig = [
                {
                    tenancyName: defaultTenancyName, 
                    configFilePath: defaultTenancyConfigFilePath , 
                    defaultProfile: defaultTenancyProfile
                },
            ] as {
                tenancyName: string;
                configFilePath: string;
                defaultProfile: string;
            }[];

            const tenancyList = [
                ...tenancyConfigList,
                ...defaultTenancyConfig,
            ]

            return new OracleCloudApi(logger, config, tenancyList);
        }

        return new OracleCloudApi(logger, config, tenancyConfigList);
    }

    /**
     * Reads configuration for a particular tenancy
     * @param name - Name of the tenancy for which config is required
     * @returns configurationFilePath and defaultProfile from the config
     * @public
     */
    public async getTenancyConfiguration(
        name?: string,
    ): Promise<{
        configurationFilePath: string,
        defaultProfile: string,
    }> {
        this.logger?.debug(
            `Getting Oracle Cloud tenancy config, for API client services`,
        );
        const options = { logger: this.logger };

        const DEFAULT_ORACLE_TENANCY_NAME = 'default';
        const tenancyName = name ? name : DEFAULT_ORACLE_TENANCY_NAME; 

        // Get the list of tenancies configured in the app-config
        // Check whether the required tenancy name exists in the configured list
        const tenancyList = OracleCloudApi.fromConfiguration(this.config, options).tenancyList;
        const checkTenancyInConfig : Boolean = tenancyList.some(
            x => x.tenancyName === tenancyName,
        )

        if(!checkTenancyInConfig) {
            throw new Error(
                `Could not find config with name ${tenancyName} . Make sure that the tenancy is properly configured.`,
            );
        }

        // Find the tenancy config instance
        // and get configFilePath and defaultProfile
        const configurationFilePath = tenancyList.find(x => 
                x.tenancyName === tenancyName
            )?.configFilePath!;

        const defaultProfile = tenancyList.find(x => 
                x.tenancyName === tenancyName
            )?.defaultProfile!;

        return {
            configurationFilePath,
            defaultProfile,
        }
    }

    /**
     * Reads profile details map from config file
     * @param configurationFilePath - Path of the Oracle configuration file
     * @param profile - Profile to be used
     * @returns a Map of the configured Profile
     * @public
     */
    public async getProfileConfig(
        configurationFilePath: string,
        profile: string,
    ): Promise<Map<string, string> | undefined> {
        const configuration = common.ConfigFileReader.parseFileFromPath(configurationFilePath, profile);
        const configProfile = configuration.accumulator.configurationsByProfile.get(profile);

        return configProfile;
    }

    /**
     * Read profile details based on tenancy name
     * Gets the config file path and default profile for tenancy
     * and passes that to {@link getProfileConfig} for Profile details map
     * @param tenancyName - Name of the tenancy 
     * @param profile - Profile to be used
     * @returns Profile details Map to read the configurations
     */
    public async getProfileConfigFromTenancy(
        tenancyName?: string,
        profile?: string,
    ): Promise<Map<string, string> | undefined>{
        const tenancyConfiguration = await this.getTenancyConfiguration(tenancyName);
        const requiredProfileName = profile ? profile : tenancyConfiguration.defaultProfile;
        const tenancyProfileConfig = (await this.getProfileConfig(tenancyConfiguration.configurationFilePath, requiredProfileName))!;

        return tenancyProfileConfig;
    }

    /**
     * Creates provider for Oracle Downstream API modules
     * @param configurationFilePath - Path of the Oracle configuration file
     * @param profile - Profile to be used
     * @returns an instance of Oracle Authentication Details Provider
     * @public
     */
    public async getAuthenticationDetailsProvider(
        configurationFilePath: string,
        profile: string,
    ): Promise<common.ConfigFileAuthenticationDetailsProvider> {
        const provider = new common.ConfigFileAuthenticationDetailsProvider(
            configurationFilePath,
            profile,
        );
        return provider;
    }

    // private async getIaasApi<T>(
    //     apiType: string,
    // ): Promise<T | undefined> {
    //     const configurationFilePath = "~/your_config_location";
    //     const profile = "your_profile_name";

    //     const provider = await this.getAuthenticationDetailsProvider(configurationFilePath, profile);
    //     switch(apiType) {
    //         case 'artifacts':
    //             return (await this.getArtifactsClient(provider)) as T;
    //         case 'identity':
    //             return (await this.getIdentityClient(provider)) as T;
    //         default:
    //             return undefined;
    //     }
    // }

}
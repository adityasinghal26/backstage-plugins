# Oracle Cloud Backend Plugin

A backend plugin implementation to connect to the Oracle Cloud API.

## Setup into a Backstage Instance

The plugin needs to be configured and then installed as per the steps in following section. 

### Configuration

The Oracle Cloud plugin allows either single or multiple Oracle Cloud tenancies, allowing to trigger REST APIs with the tenancy and profile name. The tenancy name (tenancyName) and the profile name (profile) in the API query parameters is optional, which if not provided, will utilise the default tenancy and the profile in the configuration.

#### Single Configuration

```yaml
oracleCloud:
  configFilePath: ./config
  defaultProfile: test
```

#### Multiple Configurations

```yaml
oracleCloud:
  configFilePath: ./config
  defaultProfile: test
  tenancies:
  - tenancyName: companyA
    configFilePath: ./configA
    defaultProfile: profileA1
  - tenancyName: companyB
    configFilePath: ./configB
    defaultProfile: profileB1
```

#### Sample API to get tenancy details based on tenancy and profile configurations

If the query parameters tenancyName and profile are omitted or left empty, the plugin will consider the default values for both tenancy and profile configuration.

```bash
curl --location 'http://localhost:7007/api/oracle-cloud/identity/tenancy?tenancyName=companyA&profile=profileA1'
```

### Up and Running

Follow the below steps and integrate Oracle Cloud Backend plugin into your Backstage instance.

1. First we need to add the `@backstage/plugin-oracle-cloud-backend` package to your backend:

   ```sh
   # From your Backstage root directory
   yarn add --cwd packages/backend @adityasinghal26/plugin-oracle-cloud-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/oracle-cloud.ts`, and add the
   following to it:

   ```ts
   import { createRouter } from '@adityasinghal26/plugin-oracle-cloud-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return createRouter({
       logger: env.logger,
       config: env.config,
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import oracleCloud from './plugins/oracle-cloud';
   // ...
   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const oracleEnv = useHotMemoize(module, () => createEnv('oracleCloud'));
     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/oracle-cloud', await oracleCloud(oracleEnv));
   ```

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/oracle-cloud/health` in a browser/or from Postman and it should return `{"status":"ok"}`

### New Backend System

The Oracle Cloud Backend plugin does not support the [new backend system](https://backstage.io/docs/backend-system/) currently. The plugin will be extended to support the same in upcoming versions.

import {
    coreServices,
    createBackendPlugin,
  } from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

export const oracleCloudPlugin = createBackendPlugin({
    pluginId: 'oracleCloud',
    register(env) {
        env.registerInit({
            deps: {
                logger: coreServices.logger,
                config: coreServices.rootConfig,
                httpRouter: coreServices.httpRouter,
            },
            async init({logger, config, httpRouter}) {
                httpRouter.use(
                    await createRouter({
                        logger,
                        config,
                    })
                )
            }
        })
    }
})
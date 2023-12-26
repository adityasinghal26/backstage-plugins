import { errorHandler } from '@backstage/backend-common';
import express, { response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { IdentityApi } from '../api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  identityApi?: IdentityApi;
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const identityApi = options.identityApi || IdentityApi.fromConfig(config, { logger });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/tenancy', async (request, response)  => {
    logger.info('Getting tenancy details!');
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    response.status(200).json(
      await identityApi.getTenancy(tenancyName, profile)
    )
  });

  router.use(errorHandler());
  return router;
}

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { ArtifactsApi, IdentityApi } from '../api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  identityApi?: IdentityApi;
  artifactsApi?: ArtifactsApi;
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const identityApi = options.identityApi || IdentityApi.fromConfig(config, { logger });
  const artifactsApi = options.artifactsApi || ArtifactsApi.fromConfig(config, { logger });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/identity/tenancy', async (request, response)  => {
    logger.info('Getting tenancy details!');
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    response.status(200).json(
      await identityApi.getTenancy(tenancyName, profile)
    )
  });

  router.get('/identity/tenancy/compartments', async(request, response) => {
    logger.info(`Getting compartment list`);
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    const compartmentName = request.query.compartmentName as string;
    response.status(200).json(
      await identityApi.getCompartmentsInTenancy(tenancyName, profile, compartmentName)
    )
  });

  router.get('/identity/tenancy/compartment', async(request, response) => {
    logger.info(`Getting compartment details`);
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    const compartmentName = request.query.compartmentName as string;
    response.status(200).json(
      await identityApi.getCompartmentDetailsInTenancy(compartmentName, tenancyName, profile)
    )
  });

  router.get('/artifacts/container/repositories', async(request, response) => {
    logger.info(`Getting container repositories list`);
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    const compartmentName = request.query.compartmentName as string;
    response.status(200).json(
      await artifactsApi.getContainerRepositories(compartmentName, tenancyName, profile)
    )
  });
    
  router.get('/artifacts/container/repository', async(request, response) => {
    logger.info(`Getting container images list in a repository`);
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    const compartmentName = request.query.compartmentName as string;
    const repositoryName = request.query.repositoryName as string;
    response.status(200).json(
      await artifactsApi.getContainerImagesInRepository(compartmentName, repositoryName, tenancyName, profile)
    )
  });

  router.post('/artifacts/container/repository', async(request, response) => {
    logger.info(`Create container repository in a compartment`);
    const tenancyName = request.query.tenancyName as string;
    const profile = request.query.profile as string;
    const compartmentName = request.query.compartmentName as string;
    const repositoryName = request.query.repositoryName as string;
    response.status(200).json(
      await artifactsApi.createContainerRepository(compartmentName, repositoryName, tenancyName, profile)
    )
  });

  router.use(errorHandler());
  return router;
}

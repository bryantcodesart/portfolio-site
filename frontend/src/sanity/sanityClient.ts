// sanity-client.ts
import fetch from 'node-fetch';
import { env } from 'process';
import { createClient as createExperimentalTypesafeClient } from 'sanity-codegen';
import createClient from '@sanity/client';
// eslint-disable-next-line import/no-relative-packages
import { Documents } from '../../generatedSanitySchemaTypes';

const clientConfig = {
  projectId: env.SANITY_PROJECT_ID ?? '',
  dataset: env.SANITY_DATASET ?? '',
  previewMode: false,
  token: env.SANITY_TOKEN ?? '',
  useCdn: false,
  apiVersion: '2022-07-31',
};

// @ts-ignore
export const sanityExperimentalTypesafeClient = createExperimentalTypesafeClient<Documents>({
  ...clientConfig,
  // @ts-ignore
  fetch,
});

export const sanityClient = createClient(clientConfig);

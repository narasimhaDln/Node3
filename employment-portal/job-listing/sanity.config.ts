// sanity.config.ts
import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';

// Import environment variables
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

/**
 * Export a config object only.
 * Do NOT render Studio here.
 * Use this config in a client component page with 'use client'.
 */
export const config = defineConfig({
  name: 'default',
  title: 'Job Listing Sanity Project',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

import { SanityCodegenConfig } from 'sanity-codegen';

const config: SanityCodegenConfig = {
  schemaPath: './schemas/schema',
  outputPath: '../frontend/generatedSanitySchemaTypes.ts',
};

export default config;

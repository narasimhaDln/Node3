import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { categoryType } from './categoryType';
import { jobType } from './jobType';
import { authorType } from './authorType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, jobType, authorType],
};

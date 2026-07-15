import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';
import * as authSchema from '../../modules/auth/domain';
import * as identitySchema from '../../modules/identity/domain';
import * as workSchema from '../../modules/work/domain';
import * as workflowSchema from '../../modules/workflow/domain';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const schema = { ...authSchema, ...identitySchema, ...workSchema, ...workflowSchema };

export const db = drizzle(pool, { schema });

export { pool };

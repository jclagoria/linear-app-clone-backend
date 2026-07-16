import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from './modules/auth/adapters/in/auth-controller';
import { identityRoutes } from './modules/identity/adapters/in/identity-controller';
import { issueRoutes } from './modules/work/adapters/in/issue-controller';
import { commentRoutes } from './modules/work/adapters/in/comment-controller';
import { labelRoutes } from './modules/work/adapters/in/label-controller';
import { watcherRoutes } from './modules/work/adapters/in/watcher-controller';
import { workflowRoutes } from './modules/workflow/adapters/in/controller';
import { projectRoutes } from './modules/project/adapters/in/project-controller';
import { cycleRoutes } from './modules/cycle/adapters/in/cycle-controller';
import { notificationRoutes } from './modules/notification/adapters/in/notification-controller';
import { errorHandler } from './shared/errors/error-handler';
import { env } from './shared/config/env';

const app = Fastify({
  logger: true,
});

// Register CORS
const corsOrigins =
  env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(',').map((o) => o.trim());

await app.register(cors, {
  origin: corsOrigins,
  credentials: true,
});

// Register rate limiting
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Register error handler
app.setErrorHandler(errorHandler);

// Register routes
await app.register(authRoutes, { prefix: '/api/v1/auth' });
await app.register(identityRoutes, { prefix: '/api/v1' });
await app.register(issueRoutes, { prefix: '/api/v1' });
await app.register(commentRoutes, { prefix: '/api/v1' });
await app.register(labelRoutes, { prefix: '/api/v1' });
await app.register(watcherRoutes, { prefix: '/api/v1' });
await app.register(workflowRoutes, { prefix: '/api/v1' });
await app.register(projectRoutes, { prefix: '/api/v1' });
await app.register(cycleRoutes, { prefix: '/api/v1' });
await app.register(notificationRoutes, { prefix: '/api/v1' });

// Health check
app.get('/api/health', async () => {
  return { status: 'ok' };
});

export { app };

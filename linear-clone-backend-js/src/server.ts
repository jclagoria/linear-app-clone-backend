import { app } from './app';
import { env } from './shared/config/env';
import { setupGateway } from './modules/gateway/setup';

const start = async () => {
  try {
    // Initialize Gateway WebSocket server BEFORE Fastify starts listening
    // (decorators must be added before server.start())
    await setupGateway(app);

    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

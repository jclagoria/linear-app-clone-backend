import { app } from './app';
import { env } from './shared/config/env';
import { setupGateway } from './modules/gateway/setup';

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running on port ${env.PORT}`);

    // Initialize Gateway WebSocket server on the same HTTP server
    await setupGateway(app);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

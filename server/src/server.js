import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import { ensureLocalUploadDir } from './services/storageService.js';

async function start() {
  await ensureLocalUploadDir();
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

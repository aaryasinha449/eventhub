import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { app } from './app.js';

(async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`[server] EventHub API listening on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err);
    process.exit(1);
  }
})();

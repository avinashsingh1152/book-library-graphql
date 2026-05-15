const { onRequest } = require('firebase-functions/v2/https');

// Lazy-load app to avoid loading sqlite3/firebase-admin at analysis time.
// Firebase CLI analysis times out if heavy native modules load at import.
let appPromise = null;

function getApp() {
  if (!appPromise) {
    const createApp = require('./src/app');
    appPromise = createApp();
  }
  return appPromise;
}

exports.api = onRequest(
  { region: 'us-central1', timeoutSeconds: 60, memory: '512MiB', invoker: 'public' },
  async (req, res) => {
    const app = await getApp();
    app(req, res);
  }
);

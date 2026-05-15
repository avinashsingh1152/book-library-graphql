const admin = require('firebase-admin');

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.ADMIN_SDK_PROJECT_ID,
  private_key_id: process.env.ADMIN_SDK_PRIVATE_KEY_ID,
  private_key: (process.env.ADMIN_SDK_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.ADMIN_SDK_CLIENT_EMAIL,
  client_id: process.env.ADMIN_SDK_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.warn('Firebase Admin init failed — running without auth verification:', error.message);
  }
}

module.exports = admin;

const admin = require('./firebase');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@booklib.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

async function createAdminUser() {
  if (!admin.apps.length) {
    console.warn('Firebase Admin not initialized — skipping admin user setup');
    return;
  }

  try {
    const auth = admin.auth();
    let user;

    try {
      user = await auth.getUserByEmail(ADMIN_EMAIL);
    } catch {
      user = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: 'Admin',
      });
      console.log(`Admin user created: ${ADMIN_EMAIL}`);
    }

    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`Admin ready: ${ADMIN_EMAIL} (role=admin)`);
  } catch (error) {
    console.warn('Admin user setup failed:', error.message);
  }
}

module.exports = { createAdminUser, ADMIN_EMAIL, ADMIN_PASSWORD };

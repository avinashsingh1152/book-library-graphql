const admin = require('../config/firebase');

async function verifyToken(token) {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, role: decoded.role || null };
  } catch {
    return null;
  }
}

module.exports = { verifyToken };

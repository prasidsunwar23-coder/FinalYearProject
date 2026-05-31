import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: firebase-service-account.json not found!');
  console.log('You need to:');
  console.log('1. Go to Firebase Console → Project Settings');
  console.log('2. Service Accounts tab → Generate New Private Key');
  console.log('3. Save as firebase-service-account.json in zyla-frontend/zyla folder');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

const ADMIN_EMAIL = 'admin@zyla.com';
const ADMIN_PASSWORD = 'AdminZyla@2026';

async function createAdminUser() {
  try {
    console.log('🔄 Checking if admin user exists...');
    
    try {
      const existingUser = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log('✅ Admin user already exists!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   UID: ${existingUser.uid}`);
      return;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    console.log('📝 Creating admin user...');
    const userRecord = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: 'Zyla Administrator',
      emailVerified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`\n📧 Email:    ${ADMIN_EMAIL}`);
    console.log(`🔐 Password: ${ADMIN_PASSWORD}`);
    console.log(`👤 UID:      ${userRecord.uid}`);
    console.log('\n💡 You can now log in with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();

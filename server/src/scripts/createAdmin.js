import { connectDatabase } from '../config/database.js';
import { createAdminUser } from '../services/authService.js';

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const email = getArg('--email') || process.env.ADMIN_EMAIL;
  const password = getArg('--password') || process.env.ADMIN_PASSWORD;

  if (!email) {
    console.error('Provide --email owner@example.com or set ADMIN_EMAIL');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('Provide --password or set ADMIN_PASSWORD (min 8 characters). Do not hard-code passwords in the repo.');
    process.exit(1);
  }

  await connectDatabase();
  const user = await createAdminUser(email, password);
  console.log(`Admin created: ${user.email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

import bcrypt from "bcryptjs";

const username = process.argv[2];
const password = process.argv[3];
const displayName = process.argv[4] || username;

if (!username || !password) {
  console.error("Usage: node db/create-admin.js <username> <password> [displayName]");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log(`insert into users (username, password_hash, role, display_name, is_active)
values ('${escapeSql(username)}', '${hash}', 'admin', '${escapeSql(displayName)}', 1)
on duplicate key update
  password_hash = values(password_hash),
  role = values(role),
  display_name = values(display_name),
  is_active = values(is_active);`);

function escapeSql(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("'", "''");
}

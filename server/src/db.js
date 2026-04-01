import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);
// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    rating INTEGER NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT 1,
    student_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);
// Seed admin user if not exists
const seedAdmin = () => {
    const row = db.prepare('SELECT count(*) as count FROM admins').get();
    if (row.count === 0) {
        const passwordHash = bcrypt.hashSync('admin123', 10);
        db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
        console.log('Default admin created: admin / admin123');
    }
};
seedAdmin();
export default db;
//# sourceMappingURL=db.js.map
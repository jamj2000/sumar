import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./app.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN
})

async function runSeed() {
  await db.executeMultiple(`
    DROP TABLE IF EXISTS sums;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE sums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      a INT NOT NULL,
      b INT NOT NULL,
      sum INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  const users = [
    { name: 'user1', password: 'user1' },
    { name: 'user2', password: 'user2' }
  ]

  for (const user of users) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (name, password) VALUES (?, ?)',
      args: [user.name, user.password]
    })
  }

  console.log('Seed completado: 2 usuarios de prueba creados')
  db.close()
}

runSeed().catch(console.error)
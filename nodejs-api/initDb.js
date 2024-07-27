// initDb.js
const db = require('./db');

db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  )`);

  // Create activity_zone table
  db.run(`CREATE TABLE IF NOT EXISTS activity_zone (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name TEXT NOT NULL,
    coord1_latitude TEXT NOT NULL,
    coord1_longitude TEXT NOT NULL,
    area REAL NOT NULL,
  )`);

  // Create transaction table
  db.run(`CREATE TABLE IF NOT EXISTS transaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    activity_zone_id INTEGER NOT NULL,
    sales REAL NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  // Create image_details table with a foreign key constraint
  db.run(`CREATE TABLE IF NOT EXISTS image_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url TEXT NOT NULL,
    activity_zone_id INTEGER,
    FOREIGN KEY (activity_zone_id) REFERENCES activity_zone(id)
  )`);

  // Create products table with a foreign key constraint
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    yield REAL NOT NULL,
    activity_zone_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    cost REAL NOT NULL,
    FOREIGN KEY (activity_zone_id) REFERENCES activity_zone(id)
  )`);

  // Create machine table with a foreign key constraint
  db.run(`CREATE TABLE IF NOT EXISTS machine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_name TEXT NOT NULL,
    allocation BOOLEAN NOT NULL,
    activity_zone_id INTEGER NOT NULL,
    FOREIGN KEY (activity_zone_id) REFERENCES activity_zone(id)
  )`);
});

db.close();

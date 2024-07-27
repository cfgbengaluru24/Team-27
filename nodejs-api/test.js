// seedDb.js
const db = require('./db');

db.serialize(() => {
  // Insert sample data into activity_zone
  db.run(`INSERT INTO activity_zone (location_name, coord1_latitude, coord1_longitude, area)
          VALUES ('Zone A', '34.0522', '-118.2437', 100.0)`);

//   db.run(`INSERT INTO activity_zone (location_name, coord1_latitude, coord1_longitude, area)
//           VALUES ('Zone B', '36.1699', '-115.1398', 200.0)`);

  // Get the activity_zone ids
//   db.get(`SELECT id FROM activity_zone WHERE location_name = ?`, ['Zone A'], (err, row) => {
//     const zoneAId = row.id;

//     // Insert sample data into transaction
//     db.run(`INSERT INTO transaction (type, activity_zone_id, sales, quantity, price)
//             VALUES ('Sale', ?, 5000.00, 50, 100)`, [zoneAId]);

//     // Insert sample data into products
//     db.run(`INSERT INTO products (name, yield, activity_zone_id, type, description, cost)
//             VALUES ('Product 1', 100.0, ?, 'Type A', 'Description 1', 150.0)`, [zoneAId]);

//     // Insert sample data into machine
//     db.run(`INSERT INTO machine (machine_name, allocation, activity_zone_id)
//             VALUES ('Machine 1', 1, ?)`, [zoneAId]);

//     // Insert sample data into image_details
//     db.run(`INSERT INTO image_details (description, url, activity_zone_id)
//             VALUES ('Image of Zone A', 'http://example.com/image1.jpg', ?)`, [zoneAId]);
//   });

//   db.get(`SELECT id FROM activity_zone WHERE location_name = ?`, ['Zone B'], (err, row) => {
//     const zoneBId = row.id;

//     // Insert sample data into transaction
//     db.run(`INSERT INTO transaction (type, activity_zone_id, sales, quantity, price)
//             VALUES ('Sale', ?, 10000.00, 100, 150)`, [zoneBId]);

//     // Insert sample data into products
//     db.run(`INSERT INTO products (name, yield, activity_zone_id, type, description, cost)
//             VALUES ('Product 2', 200.0, ?, 'Type B', 'Description 2', 250.0)`, [zoneBId]);

//     // Insert sample data into machine
//     db.run(`INSERT INTO machine (machine_name, allocation, activity_zone_id)
//             VALUES ('Machine 2', 0, ?)`, [zoneBId]);

//     // Insert sample data into image_details
//     db.run(`INSERT INTO image_details (description, url, activity_zone_id)
//             VALUES ('Image of Zone B', 'http://example.com/image2.jpg', ?)`, [zoneBId]);
//   });

//   // Insert sample data into users
//   db.run(`INSERT INTO users (username, password, email)
//           VALUES ('user1', 'password1', 'user1@example.com')`);

//   db.run(`INSERT INTO users (username, password, email)
//           VALUES ('user2', 'password2', 'user2@example.com')`);
});

db.close();

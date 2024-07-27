// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
// const multer = require("multer");
const cors = require("cors")

// const { getStorage, ref, uploadBytes, uploadString, getDownloadURL } = require('firebase/storage');


// const firebaseApp  = require("./firebaseConfig");
// const storage = getStorage(firebaseApp);

// const storageConfig = multer.memoryStorage();
// const upload = multer({ storage: storageConfig });
const app = express();
app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const PORT = 3001;

const db = new sqlite3.Database('./cfg_db.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL
    )`);
    console.log("User Table Ready");
  
    // Create activity_zone table
    db.run(`CREATE TABLE IF NOT EXISTS activity_zone (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_name TEXT NOT NULL,
      coord1_latitude TEXT NOT NULL,
      coord1_longitude TEXT NOT NULL,
      area REAL NOT NULL
    )`);
    console.log("Activity Zone Table Ready");
  
    // Create transaction_details table
    db.run(`CREATE TABLE IF NOT EXISTS transaction_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      activity_zone_id INTEGER NOT NULL,
      sales REAL NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
    console.log("Transaction_Details Table Ready");
  
    // Create image_details table with a foreign key constraint
    db.run(`CREATE TABLE IF NOT EXISTS image_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      url TEXT NOT NULL,
      url_compressed TEXT NOT NULL,
      activity_zone_id INTEGER,
      FOREIGN KEY (activity_zone_id) REFERENCES activity_zone(id)
    )`);
    console.log("Image Details Table Ready");
  
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
    console.log("Products Table Ready");
  
    // Create machine table with a foreign key constraint
    db.run(`CREATE TABLE IF NOT EXISTS machine (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_name TEXT NOT NULL,
      allocation BOOLEAN NOT NULL,
      activity_zone_id INTEGER NOT NULL,
      FOREIGN KEY (activity_zone_id) REFERENCES activity_zone(id)
    )`);
    console.log("Machine Table Ready");
});



// User registration
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).send('Missing required fields');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], function(err) {
    if (err) {
      return res.status(500).send('Error creating user');
    }
    res.status(201).send('User registered');
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Missing username or password');
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(404).send('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Incorrect password');
    }

    res.status(200).send('Login successful');
  });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching users');
      }
      res.status(200).json(rows);
    });
  });

// Insert into transaction_details table
app.post('/transaction', (req, res) => {
  const { type, activity_zone_id, sales, quantity, price } = req.body;
  db.run('INSERT INTO transaction_details (type, activity_zone_id, sales, quantity, price) VALUES (?, ?, ?, ?, ?)', 
    [type, activity_zone_id, sales, quantity, price], 
    function(err) {
      if (err) {
        return res.status(500).send('Error inserting transaction details');
      }
      res.status(201).send('Transaction Details Recorded');
    });
});

// Insert into image_details table
app.post('/image_details', (req, res) => {
    console.log("Posting Image details")
  const { description,
    url,
    url_compressed,
    activity_zone_id } = req.body;
    console.log(description, url, url_compressed)
  db.run('INSERT INTO image_details (description, url, url_compressed, activity_zone_id) VALUES (?, ?, ?, ?)', 
    [description, url, url_compressed, activity_zone_id], 
    function(err) {
      if (err) {
        return res.status(500).send('Error inserting image details');
      }
      res.status(201).send('Image details recorded');
    });
});

app.get('/image_details', (req, res) => {
    db.all('SELECT * FROM image_details', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching image details');
      }
      res.status(200).json(rows);
    });
  });

// Insert into activity_zone table
app.post('/activity_zone', (req, res) => {
  const { location_name, coord1_latitude, coord1_longitude, area } = req.body;
  db.run('INSERT INTO activity_zone (location_name, coord1_latitude, coord1_longitude, area) VALUES (?, ?, ?, ?, )', 
    [location_name, coord1_latitude, coord1_longitude, area], 
    function(err) {
      if (err) {
        return res.status(500).send('Error inserting activity zone');
      }
      res.status(201).send('Activity zone recorded');
    });
});

app.get('/activity_zone', (req, res) => {
    db.all('SELECT * FROM activity_zone', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching activity zones');
      }
      res.status(200).json(rows);
    });
  });

// Insert into products table
app.post('/products', (req, res) => {
  const { name, yield_value, activity_zone_id, type, description, cost } = req.body;
  db.run('INSERT INTO products (name, yield, activity_zone_id, type, description, cost) VALUES (?, ?, ?, ?, ?, ?)', 
    [name, yield_value, activity_zone_id, type, description, cost], 
    function(err) {
      if (err) {
        return res.status(500).send('Error inserting product');
      }
      res.status(201).send('Product recorded')
    });
});

app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching products');
      }
      res.status(200).json(rows);
    });
  });
  
// Insert into machine table
app.post('/machine', (req, res) => {
  const { machine_name, allocation, location_id } = req.body;
  db.run('INSERT INTO machine (machine_name, allocation, location_id) VALUES (?, ?, ?)', 
    [machine_name, allocation, location_id], 
    function(err) {
      if (err) {
        return res.status(500).send('Error inserting machine');
      }
      res.status(201).send('Machine recorded');
    });
});

app.get('/machine', (req, res) => {
    db.all('SELECT * FROM machine', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error fetching machines');
      }
      res.status(200).json(rows);
    });
  });

//   app.post("/upload-image", upload.single("image"), async (request, res) => {
    
//     try {
    
//       if (!request.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
//       const dataURL = `data:${
//         request.file.mimetype
//       };base64,${request.file.buffer.toString("base64")}`;
//       const storageRef = ref(storage, `images/${request.file.originalname}`);
//     //   console.log("hey", request.file)
//     //   await uploadBytes(storageRef, dataURL);
//     // const img = await storageRef.
//     await uploadString(storageRef, dataURL, "data_url");
//       const downloadURL = await getDownloadURL(storageRef);
//       res.status(200).json({ downloadURL });
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

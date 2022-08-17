const {
  client,
  // declare your model imports here
  // for example, User
} = require('./');

async function buildTables() {
  console.log('dropping all tables')
  try {
    client.connect();
    console.log()
    await client.query(`
    DROP TABLE IF EXISTS cart_history;    
    DROP TABLE IF EXISTS cart;    
    DROP TABLE IF EXISTS products;  
    DROP TABLE IF EXISTS address;      
    DROP TABLE IF EXISTS payment;    
    DROP TABLE IF EXISTS users;
   `);

    // drop tables in correct order
    console.log("creating database tables")
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) NOT NULL,
      email varchar(255) UNIQUE NOT NULL, 
      admin BOOLEAN DEFAULT false,
      password varchar(255) NOT NULL
    );
    CREATE TABLE payment (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      type varchar(255) NOT NULL,
      number INTEGER NOT NULL,
      "expMonth" INTEGER NOT NULL,
      "expYear" INTEGER NOT NULL, 
      cvv INTEGER NOT NULL
    );
    CREATE TABLE address (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      street varChar(255) NOT NULL,
      zip INTEGER NOT NULL,
      city varchar(255) NOT NULL,
      state varchar(255) NOT NULL
    );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY, 
        name varchar(255) NOT NULL,
        pictures varchar(255),
        description varchar(255),
        price INTEGER NOT NULL,
        active BOOLEAN DEFAULT true
      ); 
      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        price INTEGER,
        purchased BOOLEAN DEFAULT false
      );
      CREATE TABLE cart_history (
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "cartId" INTEGER REFERENCES cart(id),
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL
      );
    `);
    // build tables in correct order
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    const userData = [
    {
      username:"arodri",
      email:"arodri@gmail.com",
      admin:false,
      password:"rodri21",
    },
    {
      username:"samval",
      email:"samval23@gmail.com",
      admin:false,
      password:"valvalop",
    },
    {
      username:"jonnyb",
      email:"jonbrink@yahoo.com",
      admin:true,
      password: "wheresjon2",
    },

  ]
    console.log("populating data")
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());

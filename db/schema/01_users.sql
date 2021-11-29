-- Drop and recreate Users table (Example)


DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(64) NOT NULL,
  phone VARCHAR(15) NOT NULL
);

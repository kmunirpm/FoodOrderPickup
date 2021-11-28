-- Drop and recreate orders table (Example)

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total INTEGER NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(255) NOT NULL,
  ready_time_seconds INTEGER
);

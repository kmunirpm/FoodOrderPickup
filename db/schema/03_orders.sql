-- Drop and recreate orders table (Example)

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total INTEGER NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Received',
  ready_time_seconds INTEGER,
  msg_counter SMALLINT DEFAULT 0,
  msg_time DATE
);

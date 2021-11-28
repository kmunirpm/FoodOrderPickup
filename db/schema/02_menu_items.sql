-- Drop and recreate menu_items table (Example)


DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_in_cents INTEGER NOT NULL DEFAULT 0,
  picture_url VARCHAR(255) NOT NULL

);

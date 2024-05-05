CREATE TABLE car (
  car_id BIGINT(255) PRIMARY KEY,
  url VARCHAR(510) NOT NULL,
  region VARCHAR(255) NOT NULL,
  region_url VARCHAR(510) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  year INT NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  conditions VARCHAR(255) NOT NULL,
  cylinders VARCHAR(255),
  fuel VARCHAR(255) NOT NULL,
  odometer INT NOT NULL,
  title_status VARCHAR(255) NOT NULL,
  transmission VARCHAR(255) NOT NULL,
  VIN VARCHAR(255) NOT NULL,
  drive VARCHAR(5) NOT NULL,
  size VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  paint_color VARCHAR(255) NOT NULL,
  image_url VARCHAR(510) NOT NULL,
  description TEXT NOT NULL,
  state VARCHAR(5) NOT NULL,
  lati DECIMAL(10,6),
  longi DECIMAL(10,6),
  posting_date DATETIME NOT NULL,
  clusters INT NOT NULL
);
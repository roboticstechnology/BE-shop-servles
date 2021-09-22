
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id uuid DEFAULT uuid_generate_v4() NOT null PRIMARY KEY,
    title text NOT null UNIQUE,
    description text,
    price numeric CHECK (price > 0)
);

CREATE TABLE IF NOT EXISTS stocks (
 	id uuid DEFAULT uuid_generate_v4() NOT null PRIMARY KEY,
    product_id uuid REFERENCES products (id),
    count int
);

/*WITH products as (
    insert into products (title, description, price) values
    ('SAMSUNG Galaxy S20', 'SAMSUNG Galaxy S20 FE 5G Factory Unlocked Android Cell Phone 128GB US Version Smartphone Pro-Grade Camera 30X Space Zoom Night Mode, Cloud Navy', 549),
    ('Moto G Power', 'Moto G Power | 2021 | 3-Day battery | Unlocked | Made for US by Motorola | 4/64GB | 48MP Camera | Gray', 199.99),
    ('TracFone My Flip 2', 'TracFone My Flip 2 4G LTE Prepaid Flip Phone (Locked) - Black - 4GB - Sim Card Included - CDMA', 19.88),
    ('Samsung Electronics Galaxy A12', 'Samsung Electronics Galaxy A12, Factory Unlocked Smartphone, Android Cell Phone, Multi-Camera System, Expandable Storage, US Version, 32GB, Black', 179),
    ('OnePlus Nord N200', 'OnePlus Nord N200 | 5G Unlocked Android Smartphone U.S Version | 6.49 Full HD+LCD Screen | 90Hz Smooth Display | Large 5000mAh Battery | Fast Charging | 64GB Storage | Triple Camera', 239.99)
    RETURNING *
)
insert into stocks (product_id, count) values
((select products.id from products where products.title = 'SAMSUNG Galaxy S20'), 12),
((select products.id from products where products.title = 'Moto G Power'), 12),
((select products.id from products where products.title = 'TracFone My Flip 2'), 12),
((select products.id from products where products.title = 'Samsung Electronics Galaxy A12'), 12),
((select products.id from products where products.title = 'OnePlus Nord N200'), 12);

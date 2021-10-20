CREATE TABLE products (
 	id  uuid primary key,
    title varchar(80) not null,
    description varchar(80),
    price  int
);
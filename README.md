To Start the server, run the following commands in the project directory
```
  npm i
  npm run dev
```

The server will only work if there is some SQL db hosted. 
You can use mysql through Xampp. Download [Xampp](https://www.apachefriends.org/download.html).
After installing Xampp, open the application and click on start mysql.

Create a db named campaigndashboard, create tables in that db named - Users, products.

```
use campaigndashboard;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

INSERT INTO users (email, password, role)
VALUES ('abcd@gmail.com', '$2b$10$j/1DpqgBsUBxKLbXEpW6x.s23oRufBhWrpSOFFo3ZnJ/x2P9xExAm', 'admin');

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    prodName VARCHAR(255) NOT NULL,
    prodDesc TEXT,
    prodImage VARCHAR(255),
    unitPrice DECIMAL(10, 2) NOT NULL,
    prodCategory VARCHAR(100) NOT NULL
);

INSERT INTO products (prodName, prodDesc, prodImage, unitPrice, prodCategory)
VALUES ('product 1', 'Product Description', 'product_image.jpg', 29.99, 'Electronics');

```
The password hash in the example setup is for "testers123" use this password to login for abcd@gmail.com
Note: SQl server should be running on port 3306




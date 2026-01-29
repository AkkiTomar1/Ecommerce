🛒 Mini E-Commerce Backend (API Only)

This project is a RESTful backend API for a mini e-commerce system developed using Node.js, Express.js, and MongoDB.
It implements JWT-based authentication, role-based authorization (Admin & Customer), and complete product and order management with interactive Swagger (OpenAPI) documentation.

🚀 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT (JSON Web Token)

Authorization: Role-based access control (Admin / Customer)

API Docs: Swagger (OpenAPI)

Password Security: bcrypt hashing

🔐 Authentication & Authorization

User Signup & Login using JWT

Secure password hashing using bcrypt

Protected routes using middleware

Role-based access:

Admin: Manage products & inventory

Customer: Place orders & view order history

🛍️ Features
👤 User

Register & Login

Receive JWT token

📦 Product (Admin Only)

Add product

Update product price & stock

Delete product

View product list

🧾 Orders (Customer Only)

Place order with stock validation

Auto stock deduction after order

View order history

View order details

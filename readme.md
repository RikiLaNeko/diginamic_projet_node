# BAR API BY MABUSO PIERRE, KHLFI WISSEM, CHLOE MORTREUX

A comprehensive RESTful API for bar management, including beer inventory and order processing.

## Overview
This API allows bars to:
Manage their profile information
Maintain beer inventory with detailed information
Process customer orders
Generate order reports and statistics

## Technologies
Node.js
Express.js
Sequelize ORM
SQLite database
JSON Web Tokens (JWT) for authentication

## Installation
```bash
# Clone the repository
git clone https://github.com/RikiLaNeko/diginamic_projet_node

# Install dependencies
npm install

# Configure environment variables (or use defaults)
cp .env.example .env

# Start the server
npm run dev

# Run tests
npm test
```

## Endpoints

## Authentication
- `POST /bars/register` - Register a new bar
- `POST /bars/login` - Authenticate a bar

## Bars
- `GET /bars` - List all bars
    - Query parameters: `ville`, `name`
- `GET /bars/:id_bar` - Get bar details
- `PUT /bars/:id_bar` - Update bar information
- `DELETE /bars/:id_bar` - Delete a bar

## Beers
- `POST /bars/:id_bar/biere` - Add beer to bar inventory
- `GET /bars/:id_bar/biere` - List all beers for a bar
    - Query parameters: `sort`, `limit`, `offset`, `degree_min`, `degree_max`, `prix_min`, `prix_max`
- `GET /biere/:id_biere` - Get beer details
- `PUT /biere/:id_biere` - Update beer information
- `DELETE /biere/:id_biere` - Delete a beer

## Orders
- `POST /bars/:id_bar/commandes` - Create a new order
- `GET /bars/:id_bar/commandes` - List all orders for a bar
    - Query parameters: `date`, `prix_min`, `prix_max`, `status`, `name`
- `GET /commandes/:id` - Get order details
- `PUT /commandes/:id_commande` - Update an order
- `DELETE /commandes/:id_commande` - Delete an order
- `GET /commandes/details/:id_commande` - Generate PDF for order

## Beer-Order Relationships
- `GET /biere_commande/commandes/:id_commande/biere` - List all beers in an order
- `POST /biere_commande/commandes/:id_commande/biere/:id_biere` - Add beer to an order
- `DELETE /biere_commande/commandes/:id_commande/biere/:id_biere` - Remove beer from an order

```bash
Authorization: Bearer <your_token>
```


# Contributors
MABUSO Pierre

KHLFI Wissem

MORTREUX Chloe
const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'vikash',
  database: 'node'
});

const orders = [
  {
    title: 'Order 1',
    description: 'Description for Order 1'
  },
  {
    title: 'Order 2',
    description: 'Description for Order 2'
  },
  {
    title: 'Order 3',
    description: 'Description for Order 3'
  }
];

function insertOrders(callback) {
  let insertedCount = 0;
  for (const order of orders) {
    const query = `
      INSERT INTO orders (title, description)
      VALUES (?, ?)
    `;
    const values = [order.title, order.description];

    pool.query(query, values, (error, result) => {
      insertedCount++;
      if (error) {
        console.error('Error inserting order:', error);
      } else {
        console.log('Order inserted successfully');
      }

      if (insertedCount === orders.length) {
        callback();
      }
    });
  }
}

insertOrders(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const query = `
    SELECT *
    FROM orders
    WHERE createdAt >= ?
  `;

  pool.query(query, [sevenDaysAgo], (error, results) => {
    if (error) {
      console.error('Error retrieving orders:', error);
    } else {
      console.log('Orders created in the past 7 days:', results);
    }

    // Close the connection pool
    pool.end();
  });
});

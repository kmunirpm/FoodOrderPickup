/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET details of the selected order
  router.get("/:id", (req, res) => {
    db.query(
      `SELECT * FROM orders JOIN ordered_items ON orders.id = order_id WHERE order_id = ${req.params.id};`
    )
      .then((data) => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET all the orders for selected user
  router.get("/user/:id", (req, res) => {
    db.query(`SELECT * FROM orders WHERE user_id = ${req.params.id};`)
      .then((data) => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST order is placed. record stored in database. sms sent to owner
  router.post("/", (req, res) => {
    console.log(req.query);
    db.query(
      `INSERT INTO orders (user_id, total, date) values ($1, $2, $3);
                INSERT INTO ordered_items (order_id, menu_item_id, quantity) values ($1, $2, $3)`
    )
      .then((data) => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

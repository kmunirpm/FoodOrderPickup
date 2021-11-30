/*
 * All routes for Admin are defined here
 * Since this file is loaded in server.js into admin,
 *   these routes are mounted onto /admin
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {

  //GET all the orders listed for admin
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM orders ORDER BY date DESC;`)
      .then((data) => {
        const menu = data.rows;
        res.render("admin_orders", { menu });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET the orders selected by admin
  router.get("/order/:id", (req, res) => {
    db.query(`SELECT * FROM orders JOIN ordered_items ON orders.id = order_id WHERE order_id = ${req.params.id};`)
      .then((data) => {
        const menu = data.rows;
        res.render("admin_order_selected", { menu });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST owner changes status of order. sms sent to customer with pickup time
  router.post("/order/:id/status", (req, res) => {
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

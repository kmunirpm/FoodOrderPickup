/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
let shoppingCart = {};

module.exports = (db) => {
  // GET details of the selected order
  router.get("/details/:id", (req, res) => {
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
  router.post("/ordered", (req, res) => {
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

  //view the cart
  router.get("/cart", (req, res) => {
    console.log(shoppingCart);
    return res.render("orders_cart", { shoppingCart });
  });

  //add item to the cart
  router.post("/cart", (req, res) => {
    req.body.longURL;
    db.query(`SELECT * FROM menu_items where id = ${req.body.pid};`)
      .then((data) => {
        const menu = data.rows[0];
        if (typeof shoppingCart[menu.id] === "undefined") {
          shoppingCart[menu.id] = menu;
          shoppingCart[menu.id].qty = 1;
        } else {
          shoppingCart[menu.id].qty += 1;
        }
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //modifies the shopping cart
  router.post("/cart/modify", (req, res) => {
    console.log(req.body);
    if (typeof req.body.edit !== "undefined") {
      shoppingCart[req.body.pid].qty = req.body.qty;
    } else if (typeof req.body.delete !== "undefined") {
      delete shoppingCart[req.body.pid];
    }
    return res.render("orders_cart", { shoppingCart });
  });

  return router;
};

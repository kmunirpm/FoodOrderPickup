/*
 * All routes for OrderDetails are defined here
 * Since this file is loaded in server.js into api/orderdetails,
 *   these routes are mounted onto /orderdetails
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
let shoppingCart = [];

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM orderdetails;`)
      .then((data) => {
        const orderdetails = data.rows;
        res.json({ orderdetails });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/cart", (req, res) => {
    res.send(shoppingCart);
  });

  //add item to the cart
  router.get("/cart/:id", (req, res) => {
    db.query(`SELECT * FROM menu_items where id = ${req.params.id};`)
      .then((data) => {
        const menu = data.rows;
        shoppingCart.push(menu);
        console.log(shoppingCart);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    res.redirect("/orderdetails/cart");
  });

  return router;
};

/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const orderdetails = require("./orderdetails");
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

let shoppingCart = {};

const formatDate = function (date) {
  console.log("date:", date);
  let dateOptions = { month: "long", day: "numeric", year: "numeric" };

  let dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);
  let dateAsFormattedString = dateFormatter.format(new Date(date));
  console.log("dateAsFormattedString:", dateAsFormattedString);
  return dateAsFormattedString;
};

module.exports = (db) => {
  // GET details of the selected order
  router.get("/user/:id", (req, res) => {
    db.query(`SELECT * FROM orders WHERE user_id = ${req.params.id};`)
      .then((data) => {
        const orders = data.rows;
        console.log("orders:", orders);
        console.log("shoppingCart: ", shoppingCart);
        let formattedOrders = orders.map((order) => {
          console.log(order);
          return {
            formattedDate: formatDate(order.date),
            ...order,
          };
        });
        res.render("orders_users", { orders: formattedOrders, shoppingCart });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET details of the selected order
  router.get("/selected/:id", (req, res) => {
    db.query(
      `SELECT * FROM orders
      JOIN ordered_items ON orders.id = order_id
      JOIN menu_items ON menu_items.id =  menu_item_id
      WHERE order_id = ${req.params.id};`
    )
      .then((data) => {
        const orders = data.rows;
        console.log("orders for selected/:id:", orders);
        console.log("shoppingCart: ", shoppingCart);
        res.render("orders_selected", { orders, shoppingCart });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST order is placed. record stored in database. sms sent to owner
  router.post("/ordered", (req, res) => {
    let val = "";
    let params = [];
    params.push(1);
    let order_total = 0;
    for (const key in shoppingCart) {
      val += `((select id from inserted_id), ${shoppingCart[key].id}, ${shoppingCart[key].qty}), `;
      order_total +=
        shoppingCart[key].qty * (shoppingCart[key].price_in_cents / 100);
    }
    params.push(order_total);
    val = val.substring(0, val.length - 2);

    const queryString = `WITH inserted_id AS (INSERT INTO orders (user_id, total, date, status) values ($1, $2, Now(), 'Placed') RETURNING id)
                        INSERT INTO ordered_items (order_id, menu_item_id, quantity) VALUES ${val} RETURNING (select id from inserted_id)`;
    db.query(queryString, params)
      .then((data) => {
        const orders = data.rows[0];
        client.messages
          .create({
            body: `New order placed. Order # is ${orders.id} \n
                   Order details\n
                   ------------------------------\n
                   ${JSON.stringify(shoppingCart)}`,
            from: "+18022558617", //valid Twilio number
            to: "+16478741655",
          })
          .then((message) => console.log(message.sid));
        shoppingCart = {};
        return res.render("orders_ordered", { orders });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //view the cart
  router.get("/cart", (req, res) => {
    return res.render("orders_cart", { shoppingCart });
  });

  //add item to the cart
  router.post("/cart", (req, res) => {
    db.query(`SELECT * FROM menu_items where id = ${req.body.pid};`)
      .then((data) => {
        const menu = data.rows[0];
        if (typeof shoppingCart[menu.id] === "undefined") {
          shoppingCart[menu.id] = menu;
          shoppingCart[menu.id].qty = 1;
        } else {
          shoppingCart[menu.id].qty += 1;
          //shoppingCart.counter =
        }
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //modifies the shopping cart
  router.post("/cart/modify", (req, res) => {
    if (typeof req.body.edit !== "undefined") {
      shoppingCart[req.body.pid].qty = req.body.qty;
    } else if (typeof req.body.delete !== "undefined") {
      delete shoppingCart[req.body.pid];
    }
    return res.render("orders_cart", { shoppingCart });
  });

  return router;
};

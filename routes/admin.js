/*
 * All routes for Admin are defined here
 * Since this file is loaded in server.js into admin,
 *   these routes are mounted onto /admin
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);


module.exports = (db) => {

  //GET all the orders listed for admin
  router.get("/", (req, res) => {
    db.query(`SELECT orders.*, name FROM orders
              JOIN users ON users.id = user_id order by orders.id desc, date desc;`)
      .then((data) => {
        const orders = data.rows;
        res.render("admin_orders", { orders});
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET all the orders listed for admin
  router.get("/filter/:filter", (req, res) => {
    db.query(`SELECT orders.*, name FROM orders
              JOIN users ON users.id = user_id where LOWER(status) = LOWER('${req.params.filter}')
    ORDER BY  id desc, date desc;`)
      .then((data) => {
        const orders = data.rows;
        res.render("admin_orders", { orders});
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


  //GET the orders selected by admin
  router.get("/order/:id", (req, res) => {
    db.query(`SELECT *, users.name as uname FROM orders
              JOIN users ON users.id = user_id
              JOIN ordered_items ON orders.id = order_id
              JOIN menu_items ON menu_items.id = menu_item_id
              WHERE order_id = ${req.params.id};`)
      .then((data) => {
        const orders = data.rows;
        res.render("admin_order_selected", { orders });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


  //POST owner changes status of order. sms sent to customer with pickup time
  router.post("/order/:id", (req, res) => {
    db.query(`UPDATE orders SET status = 'Ready', msg_counter=msg_counter+1, msgtime=Now(), ready_time_seconds = ${req.body.time_in_sec}
              WHERE id = ${req.body.oid} RETURNING msg_counter;`)
      .then((data) => {
        const orders = data.rows;
        client.messages
          .create({
            body: `Order status updated for OrderID: ${req.body.oid}. Please pick you order after: ${req.body.time_in_sec}/60 mins.` ,
            from: "+18022558617", //valid Twilio number
            to: "+16478741655", //customer phone #
          })
          .then((message) => console.log(message.id));
        //res.redirect("/admin/order/" + req.body.oid);
        res.status(200).send(orders);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


  //POST owner changes status of order. sms sent to customer with pickup time
  router.post("/order/:id/markcompleted", (req, res) => {
    db.query(`UPDATE orders SET status = 'Completed'
              WHERE id = ${req.body.oid};`)
      .then((data) => {
        res.redirect('/admin/order/' + req.body.oid);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
0000

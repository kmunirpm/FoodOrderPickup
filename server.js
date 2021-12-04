// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const sessions = require('express-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["key1", "key2"],
//   })
// );

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const ordersRoutes = require("./routes/orders");
const orderdetailsRoutes = require("./routes/orderdetails");
const adminRoutes = require("./routes/admin");
const { json } = require("express");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/orders", ordersRoutes(db));
app.use("/orderdetails", orderdetailsRoutes(db));
app.use("/admin", adminRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {

  db.query(`SELECT * FROM menu_items LIMIT 6;`)
  .then(data => {
    const menu = data.rows;
    res.render("index", {menu});
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
});

// app.get("/test", (req, res) => {
//   res.render("index1.ejs", {
//       data: {
//           data: {
//               "glossary": {
//                   "title": "example glossary",
//                   "GlossDiv": {
//                       "title": "S",
//                       "GlossList": {
//                           "GlossEntry": {
//                               "ID": "SGML",
//                               "SortAs": "SGML",
//                               "GlossTerm": "Standard Generalized Markup Language",
//                               "Acronym": "SGML",
//                               "Abbrev": "ISO 8879:1986",
//                               "GlossDef": {
//                                   "para": "A meta-markup language, used to create markup languages such as DocBook.",
//                                   "GlossSeeAlso": ["GML", "XML"]
//                               },
//                               "GlossSee": "markup"
//                           }
//                       }
//                   }
//               }
//           }
//       }
//   })
// });


app.listen(PORT, () => {
  console.log(`Food Order app listening on port ${PORT}`);
});

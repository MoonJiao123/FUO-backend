/**
 * Description:
 * This is the file to start our server.
 * It contains the main back-end logic for our server.
 * 
 * Express Methods:
 * -app.get():
 *  Routes HTTP GET requests to the specified path with the specified callback functions.
 * 
 * -app.post():
 *  Routes HTTP POST requests to the specified path with the specified callback functions. 
 * 
 * -app.use():
 *  Mounts the specified middleware function or functions at the specified path: the middleware function is executed 
 *  when the base of the requested path matches path.
 * 
 * -app.listen():
 *  Binds and listens for connections on the specified host and port
 *
 * Contributors: Yue Jiao, Yunning Yang, Derek Ta, Shawn Koo 
 */

var express = require('express') //set up middleware for API and allow dynamic rendering of pages
var cors = require('cors') // handle the cors domain requests
var bodyParser = require('body-parser') //allow us to extract the data sent from the FE
var app = express()
var path = require('path')
const port = process.env.PORT || 5000;

/* Secret key used for the session*/
const SESSION_SECRET = 'secret'

//app.use mounts the middleware function at a specific path
app.use(bodyParser.json())
app.use(cors())

//parse the data with json, the query string library
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

const db = require("./config/DB.js");
db.sequelize.sync();

/*Setting up the express sessions for usage*/
app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: SESSION_SECRET,
  cookie: {
    userType: "None",  // Business, Customer
    user_id: 0
  }
}))

// respond with { Hello: 'World' } when a GET request is made to the landing page
app.get('/', function (req, res) {
  res.send(JSON.stringify({ Hello: 'World' }));

  req.session.reload(function(err) {
    // Just loaded a session is all from a previous
  })
});

//access both business users and customer users route
var Users = require('./controllers/AuthController.js')

app.use('/users', Users)

//access product management route
var Product = require('./controllers/ProductController.js')

app.use('/product', Product)

//access business management route
var Business = require('./controllers/BusinessController.js')

app.use('/business', Business)

//access product_upload route
var Cart = require('./controllers/ShoppingCartController.js')

app.use('/cart', Cart)

app.get('/api/getList', (req, res) => {
  var list = ["item1", "item2", "item3"];
})

app.get('/api/getList', (req, res) => {
  var list = ["item1", "item2", "item3"];
  res.json(list);
  res.status(200).json({ message: 'Sent list of items' });
  //console.log('Sent list of items');
});

//access API to listen to a port
app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})
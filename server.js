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
 * Contributors: Yue Jiao, Yunning Yang
 */

var express = require('express') //set up middleware for API and allow dynamic rendering of pages
var cors = require('cors') // handle the cors domain requests
var bodyParser = require('body-parser') //allow us to extract the data sent from the FE
var app = express()
var path = require('path')
var session = require('express-session')
const uuid = require('uuid/v4')
const redis = require('redis')
const RedisStore = require('connect-redis')(session); 

const port = process.env.PORT || 5000;


//Secret key used by the session
const SESSION_SECRET = 'session_secret';
const MEMCACHED_SECRET = 'memcached_secret';

//Create the client
//const redisClient  = redis.createClient();
var redisClient = require('redis').createClient(process.env.REDIS_URL);

//app.use mounts the middleware function at a specific path
app.use(bodyParser.json())
app.use(cors())

//Create redis client( session server)
redisClient.on('error', (err) => {
  console.log('Redis Session Error: ', err)
});

//App uses the session with the specified information
//try to connect to heroku using the heroku url insteam of local
app.set('trust proxy', 1);
app.use(session({
  genid: (req) =>{
    return uuid()
  },
  store: new RedisStore({
    url: process.env.REDIS_URL,
    client: redisClient
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: false}
})); 


//parse the data with json, the query string library
app.use( 
  bodyParser.urlencoded({
    extended: false
  })
)

const db = require("./config/DB.js");
db.sequelize.sync();


// respond with { Hello: 'World' } when a GET request is made to the landing page
app.get('/', function (req, res) {
  //Initializing 
  if(req.session.cookie.userId == null)
    req.session.cookie.userId = 0; 

  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.session.cookie.userId++; 
  req.session.save();
  res.send(JSON.stringify({SessionID: req.sessionID, Views: req.session.cookie.userId == null}))
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
var Cart = require('./controllers/ShoppingListController.js')

app.use('/cart', Cart)

app.get('/api/getList', (req, res) => {
  var list = ["item1", "item2", "item3"];
})

//access product_upload route
// var Location = require('./controllers/LocationController.js')
//
// app.use('/location', Location)

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


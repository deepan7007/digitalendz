const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors')
var security = require('./server/security')
var onboard = require('./server/onboard')
var productconfig = require('./server/productconfig')
var product = require('./server/product')
var logger = require('././server/config/log4j')
var jwt_decode = require('jwt-decode');

const app = express();
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

// app.use(function (req, res) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
// });
function authChecker(req, res, next) {
  try {
    jwt_decode(req.headers.token).email
    next();
  }
  catch (ex) {
    if (req.path === '/api/auth/login' || req.path === '/api/auth/forgot-pass') {
      next();
    }
    else {
      try{
        jwt_decode(req.headers.authorization).email
        next();
      }
      catch (ex) {
          res.status(500);
          res.send('500: Internal server error');
        }

  
    }
  }
   
}
app.use(authChecker);
/*
app.use((err, req, res, next) => {
  console.log("inside middleware");
  if (!err) {
    return next();
  }
  logger.error(req);
  logger.error(err);
  res.status(500);
  res.send('500: Internal server error');
});
*/
app.use('/', security);
app.use('/', onboard);
app.use('/', product);
app.use('/', productconfig);


app.get('*'), (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
}
var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
server.listen(port, () => console.log('Server is running' + port));

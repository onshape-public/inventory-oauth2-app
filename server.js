// Get the packages we need
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const authController = require('./controllers/auth');
const partController = require('./controllers/part');
const partNumberController = require('./controllers/partNumber');
const generatorController = require('./controllers/generator');
const applicationController = require('./controllers/application');
const session = require('express-session');
const oauth2Controller = require('./controllers/oauth2');
const userController = require('./controllers/user');

// Connect to the inventoryapplicationdb MongoDB
if (process.env.ENVIRONMENT === 'production') {
  mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to prod db');
} else {
  mongoose.connect('mongodb://localhost:27017/inventoryapplicationdb');
  console.log('Connected to Local db');
}

// Create our Express application
const app = express();

app.set('view engine', 'ejs');
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.raw());

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key hard to guess',
  saveUninitialized: true,
  resave: true
}));

// Use environment defined port or 3000
const port = process.env.PORT || 3000;

// Create our Express router
const router = express.Router();

// Create endpoint handlers for /parts
router.route('/parts')
  .post(authController.isAuthenticated, partController.postParts)
  .get(authController.isAuthenticated, partController.getParts);

// Create endpointd for /generate
router.route('/v1/generate')
  .post(authController.isAuthenticated, generatorController.generate_v1);

router.route('/v4/generate')
  .post(authController.isAuthenticated, generatorController.generate_v4);

router.route('/v5/generate')
  .post(authController.isAuthenticated, generatorController.generate_v5);

// Create endpoint handlers for /parts
router.route('/parts-list')
  .get(authController.isAuthenticated, (req, res) => {
    partController.getPartsList(req, res, (err, parts) => {
      if (err) {
        res.send(err);
      }
      res.render('parts-list', { parts: parts });
    });
  });

// Create endpoint handlers for /parts/:part_id
router.route('/parts/:part_number')
  .get(authController.isAuthenticated, partController.getPart)
  .post(authController.isAuthenticated, partController.postPart)
  .delete(authController.isAuthenticated, partController.deletePart);

// Create endpoint handlers for /parts/part/:part_id
router.route('/parts/part/:part_id')
  .delete(authController.isAuthenticated, partController.deletePartById);

router.route('/nextpartnumbers')
  .post(partNumberController.incrementPartNumber);

// Create endpoint handlers for /users
router.route('/users')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/users/create-admin-user')
  .post(userController.createAdminUser)
// Create endpoint handlers for /applications
router.route('/applications')
  .post(authController.isAuthenticated, applicationController.postApplications)
  .get(authController.isAuthenticated, applicationController.getApplications);

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isApplicationAuthenticated, oauth2Controller.token);

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', (req, res) => {
  res.json({ message: 'You are running inventory application!'});
});

// Register all our routes with /api
app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port);
console.log(`Application running on port ${  port }`);
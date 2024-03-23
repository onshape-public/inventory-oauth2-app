// Get the packages we need
import express, { Router } from "express";
import { connect } from "mongoose";
import { urlencoded, json, raw } from "body-parser";
import ejs from "ejs";
import http from "http";
import { join } from "path";
import { isAuthenticated, isApplicationAuthenticated } from "./controllers/auth";
import { postParts, getParts, getPartsList, getPart, postPart, deletePart, deletePartById } from "./controllers/part";
import { incrementPartNumber } from "./controllers/partNumber";
import { generate_v1, generate_v4, generate_v5 } from "./controllers/generator";
import { postApplications, getApplications } from "./controllers/application";
import session from "express-session";
import { authorization, decision, token } from "./controllers/oauth2";
import { postUsers, getUsers, createAdminUser } from "./controllers/user";

// Connect to the inventoryapplicationdb MongoDB
if (process.env.ENVIRONMENT === "production") {
  connect(process.env.MONGODB_URI);
  console.log("Connected to prod db");
} else {
  connect("mongodb://localhost:27017/inventoryapplicationdb");
  console.log("Connected to Local db");
}

// Create our Express application
const app = express();

app.set("view engine", "ejs");
// Use the body-parser package in our application
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(json());
app.use(raw());

// Use express session support since OAuth2orize requires it
app.use(
  session({
    secret: "Super Secret Session Key hard to guess",
    saveUninitialized: true,
    resave: true,
  }),
);

// Use environment defined port or 3000
const port = process.env.PORT || 3000;

// Create our Express router
const router = Router();

// Create endpoint handlers for /parts
router
  .route("/parts")
  .post(isAuthenticated, postParts)
  .get(isAuthenticated, getParts);

// Create endpointd for /generate
router
  .route("/v1/generate")
  .post(isAuthenticated, generate_v1);

router
  .route("/v4/generate")
  .post(isAuthenticated, generate_v4);

router
  .route("/v5/generate")
  .post(isAuthenticated, generate_v5);

// Create endpoint handlers for /parts
router.route("/parts-list").get(isAuthenticated, (req, res) => {
  getPartsList(req, res, (err, parts) => {
    if (err) {
      res.send(err);
    }
    res.render("parts-list", { parts: parts });
  });
});

// Create endpoint handlers for /parts/:part_id
router
  .route("/parts/:part_number")
  .get(isAuthenticated, getPart)
  .post(isAuthenticated, postPart)
  .delete(isAuthenticated, deletePart);

// Create endpoint handlers for /parts/part/:part_id
router
  .route("/parts/part/:part_id")
  .delete(isAuthenticated, deletePartById);

router.route("/nextpartnumbers").post(incrementPartNumber);

// Create endpoint handlers for /users
router
  .route("/users")
  .post(isAuthenticated, postUsers)
  .get(isAuthenticated, getUsers);

router.route("/users/create-admin-user").post(createAdminUser);
// Create endpoint handlers for /applications
router
  .route("/applications")
  .post(isAuthenticated, postApplications)
  .get(isAuthenticated, getApplications);

// Create endpoint handlers for oauth2 authorize
router
  .route("/oauth2/authorize")
  .get(isAuthenticated, authorization)
  .post(isAuthenticated, decision);

// Create endpoint handlers for oauth2 token
router
  .route("/oauth2/token")
  .post(isApplicationAuthenticated, token);

// Initial dummy route for testing
// http://localhost:3000/api
router.get("/", (req, res) => {
  res.json({ message: "You are running inventory application!" });
});

// Register all our routes with /api
app.use("/api", router);
app.use(express.static(join(__dirname, "public")));

// Start the server
app.listen(port);
console.log(`Application running on port ${port}`);

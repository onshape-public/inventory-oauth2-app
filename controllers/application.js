// Load required packages
const Application = require("../models/application");

// Create endpoint /api/application for POST
exports.postApplications = function (req, res) {
  // Create a new instance of the Application model
  const application = new Application();

  // Set the application properties that came from the POST data
  application.name = req.body.name;
  application.clientId = req.body.clientId;
  application.clientSecret = req.body.clientSecret;
  application.userId = req.user._id;

  // Save the application and check for errors
  application.save((err) => {
    if (err) {
      res.send(err);
    }

    res.json({
      message: "Application added to the locker!",
      data: application,
    });
  });
};

// Create endpoint /api/applications for GET
exports.getApplications = function (req, res) {
  // Use the Application model to find all applications
  Application.find({ userId: req.user._id }, (err, applications) => {
    if (err) {
      res.send(err);
    }

    res.json(applications);
  });
};

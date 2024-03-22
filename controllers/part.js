// Load required packages
var Part = require('../models/part');

const getPartsList = function(req, res, callback) {
    // Use the Part model to find all part
    Part.find({ userId: req.user._id}, function(err, parts) {
        callback(err, parts);
    });
};

// Create endpoint /api/parts for POSTS
exports.postParts = function(req, res) {
  // Create a new instance of the Part model
  var part = new Part();

  // Set the part properties that came from the POST data
  part.partNumber = req.body.partNumber;
  part.name = req.body.name;
  part.quantity = req.body.quantity;
  part.revision = req.body.revision;
  part.price = req.body.price;
  part.userId = req.user._id;

  // Save the part and check for errors
  part.save()
    .then(() => {
      res.json({ message: 'Part added to the Inventory!', data: part });
    })
    .catch(err => {
      res.send(err);
    });
};

// Create endpoint /api/parts for GET
exports.getParts = function(req, res) {
  getPartsList(req, res, function(err, parts) {
    if (err)
        res.send(err);

    res.json(parts);
  });
};

exports.getPartsList = function(req, res, callback) {
    return getPartsList(req, res, callback)
};

// Create endpoint /api/parts/:part_number for GET
exports.getPart = function(req, res) {
  // Use the Part model to find a specific part
  Part.find({userId: req.user._id, partNumber: req.params.part_number}, function(err, part) {
    if (err)
      res.send(err);

    res.json(part);
  });
};

// Create endpoint /api/parts/:part_number for PUT
exports.postPart = function(req, res) {
  // Use the Part model to find a specific part
  Part.find({ userId: req.user._id, partNumber: req.params.part_number }, function(err, parts) {
    const part = parts[0];
    if (err)
      res.send(err);

    // Update the existing part quantity
    part.quantity = req.body.quantity;
    part.revision = req.body.revision;

    // Save the part and check for errors
    part.save(function(err) {
      if (err)
        res.send(err);

      // res.json(part);
      res.json({ message: 'Part updated!', data: part });
    });
  });
};

// Create endpoint /api/parts/:part_number for DELETE
exports.deletePart = function(req, res) {
  // Use the Part model to find a specific part and remove it
  Part.remove({ userId: req.user._id, partNumber: req.params.part_number }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Part removed from the Inventory!' });
  });
};

// Create endpoint /api/parts/part/:id for DELETE
exports.deletePartById = function(req, res) {
  Part.findByIdAndRemove(req.params.part_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Part removed from the locker new!' });
  });
};
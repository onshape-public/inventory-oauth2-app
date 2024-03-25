// Load required packages
const PartNumber = require('../models/partNumber');

const resetPartNumber = function(req, res) {
  PartNumber.find({}, (err, response) => {
    if (err)
    {res.send(err);}

    if (response.length === 0) {
      const partNumber = new PartNumber();
      partNumber.count = 0;
      partNumber.save((err, p) => {
        if (err)
        {res.send(err);}

        res.json({ message: 'Part added to the Inventory!', data: p });
      });
    } else {
      res.json(response);
    }
  });
};
exports.resetPartNumber = resetPartNumber;
exports.incrementPartNumber = function(req, res) {
  PartNumber.findOneAndUpdate({}, { $inc: { count: 1 } }, {new: true}, (err, response) => {
    if (err)
    {res.send(err);}

    if (!response) {
      resetPartNumber(req, res);
    } else {
      const partNums = [];
      partNums.push(`PRT-${  response.count }`);
      res.json({partNumbers: partNums});
    }
  });
};
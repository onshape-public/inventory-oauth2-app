// Load required packages
var PartNumber = require('../models/partNumber');

const resetPartNumber = function(req, res) {
    PartNumber.find({}, function(err, response) {
        if (err)
        res.send(err);

        if(response.length === 0) {
            var partNumber = new PartNumber();
            partNumber.count = 0;
            partNumber.save()
                .then(() => {
                    res.json({ message: 'Part added to the Inventory!', data: p });
                })
                .catch(err => {
                    res.send(err);
                });
        } else {
            res.json(response);
        }
    });
};
exports.resetPartNumber = resetPartNumber;
exports.incrementPartNumber = function(req, res) {
    PartNumber.findOneAndUpdate({}, { $inc: { count: 1 } }, {new: true})
        .then(response => {
            if (!response) {
                resetPartNumber(req, res);
            } else {
                const partNums = [];
                partNums.push('PRT-' + response.count);
                res.json({partNumbers: partNums});
            }
        })
        .catch(err => {
            res.send(err);
        });
};

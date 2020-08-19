
var uuid = require('uuid');

exports.generate_v1 = function(req, res) {
    let status = req.query.status;
    var results = [];
    reqbody = req.body;

    if(status && status >=400 && status < 600) {
        res.status(status).json({
            "error" : "Failed to generate number"
        });
    } else {
        let response = reqbody.reduce((promiseChain, partNumber) => {
            return promiseChain.then(() => new Promise((resolve)=> {
                generate_uuid_v1(results, partNumber, resolve);
            }));
          }, Promise.resolve());
        response.then(() => res.status(200).json(results));
    }
}

function generate_uuid_v1(results, partNumber, cb) {
  setTimeout(() => {
      console.log("processing " + partNumber);
      results.push({
          "id" : partNumber.id,
          "documentId" : partNumber.documentId,
          "elementId" : partNumber.elementId,
          "workspaceId" : partNumber.workspaceId,
          "elementType" : partNumber.elementType,
          "partId" : partNumber.partId,
          "partNumber" : uuid.v1()
      });
      cb(); }, 100);
}


exports.generate_v4 = function(req, res) {
    var results = [];
    reqbody = req.body;
    let response = reqbody.reduce((promiseChain, partNumber) => {
        return promiseChain.then(() => new Promise((resolve)=> {
            generate_uuid_v4(results, partNumber, resolve);
        }));
    }, Promise.resolve());

    response.then(() => res.status(200).json(results));
}

exports.generate_v5 = function(req, res) {
    var results = [];
    reqbody = req.body;
    let response = reqbody.reduce((promiseChain, partNumber) => {
        return promiseChain.then(() => new Promise((resolve)=> {
            generate_uuid_v5(results, partNumber, resolve);
        }));
    }, Promise.resolve());

    response.then(() => res.status(200).json(results));
}

function generate_uuid_v4(results, partNumber, cb) {
    setTimeout(() => {
        console.log("processing " + partNumber);
        results.push({
            "id" : partNumber.id,
            "documentId" : partNumber.documentId,
            "elementId" : partNumber.elementId,
            "workspaceId" : partNumber.workspaceId,
            "elementType" : partNumber.elementType,
            "partId" : partNumber.partId,
            "partNumber" : uuid.v4()
        });
        cb(); }, 100);
}

function generate_uuid_v5(results, partNumber, cb) {
    setTimeout(() => {
        console.log("processing " + partNumber);
        results.push({
            "extra1" : "Extra field",
            "extra2" : "Extra field 2",
            "id" : partNumber.id,
            "documentId" : partNumber.documentId,
            "elementId" : partNumber.elementId,
            "workspaceId" : partNumber.workspaceId,
            "elementType" : partNumber.elementType,
            "partId" : partNumber.partId,
            "partNumber" : uuid.v4()
        });
        cb(); }, 100);
}
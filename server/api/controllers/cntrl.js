var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var db = require('../../../database/index.js')

// db.connect();

module.exports.getEvents = function(req, res) {
  var queryString = `SELECT events.name FROM events, comedians WHERE (comedians.email = '${req.query.email}'
    and events.id_comedians = comedians.id and events.status = 'open')`
  db.query(queryString, function (err, result){
    res.json(result);
  })
};

module.exports.getPendingEvents = function(req, res) {
  var queryString = `SELECT events.name FROM events, comedians WHERE (comedians.email = '${req.query.email}'
    and events.id_comedians = comedians.id and events.status = 'pending')`
  db.query(queryString, function (err, result){
    res.json(result);
  })
}

module.exports.getVenues = function(req, res) {
  var queryString = 'SELECT * FROM venues';
  db.query(queryString, function (err, result){
    res.json(result);
  })  
};

module.exports.getComedians = function(req, res) {
  var queryString = `SELECT * FROM comedians`
  db.query(queryString, function(err, result) {
    res.json(result);
  })
};

module.exports.getComedian = function(req, res) {
  var queryString = `SELECT username FROM comedians where 
  (username = ${req.body.username});`
  db.query(queryString, function(err, result) {
    res.json(result);
  })
};

module.exports.getAllEventsForEventPage = function(req, res) {
  console.log('req', req.query)
  var queryString = `SELECT * FROM events`
  db.query(queryString, function(err, result) {
    res.json(result);
  })
};

module.exports.audienceRegistration = function(req, res) {
  var params = [];
  for (var key in req.body) {
    params.push(req.body[key]);
  }

  var queryString = 'INSERT INTO audience (name, email, phone, id_events) VALUE (?,?,?,?)' 
  db.query(queryString, params, function(err, result) {
    res.json(result);
  })
};

module.exports.signup = function(req, res) {
  var ob = req.body;
  var queryString = `SELECT * FROM comedians where 
  (email = '${req.body.email}');`;
  db.query(queryString, function(err, result) {
    console.log('search performed');
    if (result.length > 0) {
      res.json(null);
    } else {
      var queryString = `INSERT INTO comedians 
        (name, email, password, website, phone, twitter, photo_url, bio, salt, video_url) VALUES 
        ('${ob.name}', '${ob.email}', '${ob.password}', '${ob.website}', '${ob.phone}', 
        '${ob.twitter}', '${ob.photo_url}', '${ob.photo_url}', '${ob.salt}', 'todolater')`;
      db.query(queryString, function(err, result) {
        console.log('comedian info inserted into comedians table');
        res.json({
          email: ob.email, 
          name: ob.name
        })
      })  
    }
  })
};

module.exports.bookcomedian = function(req, res) {
  console.log(req.body)
  res.end()

  var hostparams = [];
  for (var key in req.body.host){
    hostparams.push(req.body.host[key])
  }

  var queryString = 'INSERT INTO hosts (name, email, phone) VALUE (?,?,?)'
  db.query(queryString, hostparams, function(err, result) {
    if (err){
      console.log(err)
    } else {
      res.json(result);
    }
  })

  var eventparams = [];
  for (var key in req.body.event){
    eventparams.push(req.body.event[key])
  }

  var queryString = 'INSERT INTO events (date, name, description, photo_url, start_time, end_time, id_comedians, status) VALUE (?,?,?,?,?,?,?,?)'
  db.query(queryString, hostparams, function(err, result) {
    if (err){
      console.log(err)
    } else {
      res.json(result);
    }
  })

  var venueparams = [];
  for (var key in req.body.venue){
    venueparams.push(req.body.venue[key])
  }

  // NEED TO QUERY FOR HOST BEFORE INSERTING HOST ID. 
  // SHOULD PROBABLY DO THIS IN A CALLBACK/PROMISE

  var queryString = 'INSERT INTO venues (address, zipcode, photo_url, capacity, id_hosts) VALUE (?,?,?,?,?)'
  db.query(queryString, hostparams, function(err, result) {
    if (err){
      console.log(err)
    } else {
      res.json(result);
    }
  })

};

module.exports.checkLogin = function(req, res) {
  var info = req.body;
  var email = req.body.email;
  var password = req.body.password;
  var queryString = `SELECT * FROM comedians where 
  (email = '${req.body.email}');`
  db.query(queryString, function(err, result) {
    res.json(result)
  })
}



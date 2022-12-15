const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const users = data.users;
const events = data.events;

router
  .route('/:id')
  .get(async (req, res) => {
    try{
        if(!req.params.id) throw "Event ID not given";
        //more error checking
    }catch(e){
        res.status(400);
    }
    try{
        //let eventInfo = await events.getEvent(req.params.id);
        res.render("eventDetails", {info: eventInfo});
      }catch(e){
        res.status(400);
      }
    });

router//NOT DONE
  .route('/register/:id')
  .get(async (req, res) => {
    try{
        if(!req.params.id) throw "Event ID not given";
        //more error checking
    }catch(e){
        res.status(400);
    }
    try{
      //let eventInfo = await events.getEvent(req.params.id);
      res.render("eventDetails", {info: eventInfo});
    }catch(e){
      res.status(400);
    }
  });

router//NOT DONE
  .route('/favorite/:id')
  .get(async (req, res) => {
    try{
        if(!req.params.id) throw "Event ID not given";
        //more error checking
    }catch(e){
        res.status(400);
    }
    try{
        //let eventInfo = await events.getEvent(req.params.id);
        res.render("eventDetails", {info: eventInfo});
    }catch(e){
      res.status(400);
    }
  });

module.exports = router;
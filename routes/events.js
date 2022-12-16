const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const e = require("express");
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
        let eventInfo = await events.getEventById(req.params.id);
        if(req.session.user == eventInfo.postedBy){
          res.render("eventDetails", {info: eventInfo, usersRegistered: eventInfo.usersRegistered});
        }
        else{
          res.render("eventDetails", {info: eventInfo});
        }
      }catch(e){
        res.status(400);
      }
    })
  .post(async (req, res) => {    
    try{
      if(!req.session.user){
        res.render("/userLogin");
      }
    }catch(e){
      res.status(400);
    }
    try{
      if(!req.params.id) throw "Event ID not given";
      //more error checking
  }catch(e){
      res.status(400);
  }
  try{
      let deReg = await users.deregEvent(req.session.user, req.params.id);    
      let eventInfo = await events.getEventById(req.params.id);
      res.render("eventDetails", {info: eventInfo});
    }catch(e){
      res.status(400);
    }
  });
    

router
  .route('/register/:id')
  .post(async (req, res) => {
    try{
        if(!req.params.id) throw "Event ID not given";
        //more error checking
    }catch(e){
        res.status(400);
    }
    try{
      if (!req.session.user){
        res.render("userLogin", {error: "You are not logged in"});
        return;
      }
      let register = await events.registerForEvent(req.session.user, req.params.id);
      if (register.userInserted==true){
        res.render("registeredEvents");
      }else{
        throw "Was not able to register for event";
      }
    }catch(e){
      res.status(400);
    }
  });

router//NOT DONE
  .route('/favorite/:id')
  .post(async (req, res) => {
    try{
      if(!req.params.id) throw "Event ID not given";
      //more error checking
    }catch(e){
      res.status(400);
    }
    try{
      if (!req.session.user){
        res.render("userLogin", {error: "You are not logged in"});
        return;
      }
      let favorited = await events.favoritedEventsSwitch(req.session.user, req.params.id);
      if (favorited.favoritedEventsSwitched!=true){
        throw "Was not able to favorite event";
      }
    }catch(e){
      res.status(400);
    }
  });

module.exports = router;
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
        let eventInfo = await events.getEventById(req.params.id);
        res.render("eventDetails", {info: eventInfo});
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
      let deReg = await users.deregEvent(req.params.id);    //need username of user
      let eventInfo = await events.getEventById(req.params.id);
      res.render("eventDetails", {info: eventInfo});
    }catch(e){
      res.status(400);
    }
  });
    

module.exports = router;
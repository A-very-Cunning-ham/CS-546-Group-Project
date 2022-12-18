const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const e = require("express");
const users = data.users;
const events = data.events;
const helpers = require("../helpers");


  router
  .route('/search')
  .post(async (req, res) => {
    try{
      helpers.errorIfNotProperString(req.body.search);

      if(req.body.search.length < 3){
        throw "Search term must be at least 2 characters"
      }
      req.body.search = req.body.search.trim();
      if (req.session.user){
        const userData = await users.getUserData(req.session.user);
        // console.log(userData);
        const upcomingEvents = await events.searchUpcomingEvents(userData.college, req.body.search);
        // console.log(upcomingEvents);
        res.render("homepage", {
          loggedIn: true,
          username: req.session.user,
          college: userData.college,
          event: upcomingEvents,
          searchTerm: req.body.search
        });
    } else{
      res.redirect("/");
    }
  }
  catch (e){
    res.status(400).render("errorPage",{
      title: "Error",
      error: e
    });
  }
});

router
  .route('/:id')//not working
  .get(async (req, res) => {
    try{
      if(!req.params.id) throw "Event ID not given";
        //more error checking
      if (!req.session.user){
        res.render("userLogin",{
          title: "Login",
          loggedIn: false,
          error: "Please log in first"
        })
        return;
      }
      let eventInfo = await events.getEventById(req.params.id);
        if(req.session.user == eventInfo.postedBy){
          res.render("eventDetails", {
            title: "Event Details",
            loggedIn: true,
            owner: true,
            info: eventInfo
          });
        }
        else{
          res.render("eventDetails", {
            title: "Event Details",
            loggedIn: true,
            owner: false,
            info: eventInfo
          });
        }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
    })
  .post(async (req, res) => {
  try{
    if(!req.session.user){
      res.render("userLogin",{
        title: "Login",
        loggedIn: false,
        error: "Please log in first"
      });
      return;
    }
    if(!req.params.id) throw "Event ID not given";
    // FIXME: what's this route doing? seems to deregister but we probably want that in its own route, not /:id
      let deReg = await users.deregEvent(req.session.user, req.params.id);    
      let eventInfo = await events.getEventById(req.params.id);
      res.render("eventDetails", {
        title: "Login",
        loggedIn: false,
        info: eventInfo
      });
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });
    

router
  .route('/register/:id')
  .post(async (req, res) => {
    try{
      if(!req.params.id) throw "Event ID not given";
      if (!req.session.user){
        res.render("userLogin", {
          title: "Login",
          loggedIn: false,
          error: "Please log in first"
        });
        return;
      }
      let register = await events.registerForEvent(req.session.user, req.params.id);
      if (register.userInserted==true){
        res.render("registeredEvents", {
          title: "Registered Events",
          loggedIn: true
        });
      }else{
        throw "Was not able to register for event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

router
  .route('/favorite/:id')
  .post(async (req, res) => {
    try{
      if(!req.params.id) throw "Event ID not given";
      if (!req.session.user){
        res.render("userLogin", {
          title: "Login",
          loggedIn: false,
          error: "Please log in first"
        });
        return;
      }
      let favorited = await events.favoritedEventsSwitch(req.session.user, req.params.id);
      if(favorited.favoritedEventSwitched == true){
        res.render('partials/favorite', {layout: null, favorite: favorited.favoritedEventSwitched});    //ajax
      }
      if (favorited.favoritedEventSwitched!=true){
        throw "Was not able to favorite event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

module.exports = router;
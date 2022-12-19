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
        const upcomingEvents = await events.searchUpcomingEvents(userData.college, req.body.search);
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

      let info = {
        title: "Event Details",
        loggedIn: true,
        owner: false,
        registered: false,
        favorited: false,
        info: eventInfo
      }

      if(req.session.user == eventInfo.postedBy){
        info.owner = true;
      }

      let userDetails = await users.getUserData(req.session.user);

      if(userDetails.eventsRegistered.includes(req.params.id)){
        info.registered = true;
      }

      if(userDetails.favoriteEvents.includes(req.params.id)){
        info.favorited = true;
      }


      res.render("eventDetails", info);
        
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
        res.redirect("/" + req.params.id);
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
  .route('/edit/:id')
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
      //TODO edit the event in this route
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

  router
  .route('/unregister/:id')
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
      let unregister = await events.unregisterForEvent(req.session.user, req.params.id);
      if(unregister.userInserted == true){
        res.redirect("/" + req.params.id);
      }else{
        throw "Was not able to unregister for event";
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
      let favorited = await events.favoriteEvent(req.session.user, req.params.id);
      if(favorited.success == true){
        res.redirect("/" + req.params.id);
      }
      else{
        throw "Was not able to favorite event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

  router
  .route('/unfavorite/:id')
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
      let unfavorited = await events.unfavoriteEvent(req.session.user, req.params.id);
      if(unfavorited.success == true){
        res.redirect("/" + req.params.id);
      }else{
        throw "Was not able to unregister for event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

  router
  .route('/cancel/:id')
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

      let cancel = await events.cancelEvent(req.params.id, req.session.user);

      if(cancel.success == true){
        res.redirect("/" + req.params.id);
      }
      else{
        throw "Was not able to cancel event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

  router
  .route('/uncancel/:id')
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

      let uncancel = await events.uncancelEvent(req.params.id, req.session.user);

      if(uncancel.success == true){
        res.redirect("/" + req.params.id);
      }
      else{
        throw "Was not able to uncancel event";
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

module.exports = router;
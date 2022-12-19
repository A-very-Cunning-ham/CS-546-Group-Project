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
    });
  // .post(async (req, res) => {
  // try{
  //   if(!req.session.user){
  //     res.render("userLogin",{
  //       title: "Login",
  //       loggedIn: false,
  //       error: "Please log in first"
  //     });
  //     return;
  //   }
  //   if(!req.params.id) throw "Event ID not given";
  //   // FIXME: what's this route doing? seems to deregister but we probably want that in its own route, not /:id
  //     let deReg = await users.deregEvent(req.session.user, req.params.id);    
  //     let eventInfo = await events.getEventById(req.params.id);
  //     res.render("eventDetails", {
  //       title: "Login",
  //       loggedIn: false,
  //       info: eventInfo
  //     });
  //   }catch(e){
  //     res.status(400).render("errorPage",{
  //       title: "Error",
  //       error: e
  //     });
  //   }
  // });
    

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
        let allRegistered = await events.getRegistered(req.session.user);
        res.render("registeredEvents", {
          title: "Registered Events",
          loggedIn: true,
          username: req.session.user,
          event: allRegistered
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
      let user = await users.getUserData(req.session.user);
      for(let i = 0; i < user.eventsRegistered.length; i ++){
        if(user.eventsRegistered[i] == req.params.id){
          let unregister = await events.unregisterForEvent(req.session.user, req.params.id);
          if(unregister.userInserted == true){
            let allRegistered = await events.getRegistered(req.session.user);
            res.render("registeredEvents", {
              title: "Registered Events",
              loggedIn: true,
              username: req.session.user,
              event: allRegistered,
              registered: true
            });
          }else{
            throw "Was not able to unregister for event";
          }
          return;
        }
      }
      let allRegistered = await events.getRegistered(req.session.user);
      res.render("registeredEvents", {
        title: "Registered Events",
        loggedIn: true,
        username: req.session.user,
        event: allRegistered,
        registered: false
      });
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
        //res.render('partials/favorite', {layout: null, favorite: favorited.favoritedEventSwitched});    //ajax
        let allFavorites = await events.getFavorites(req.session.user);
        res.render("favorited", {
          title: "Favorited Events",
          loggedIn: true,
          username: req.session.user,
          event: allFavorites
        });
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
      let user = await users.getUserData(req.session.user);
      for(let i = 0; i < user.favoriteEvents.length; i ++){
        if(user.favoriteEvents[i] == req.params.id){
          let unfavorited = await events.unfavoriteEvent(req.session.user, req.params.id);
          if(unfavorited.success == true){
            let allFavorites = await events.getFavorites(req.session.user);
            res.render("favorited", {
            title: "Favorited Events",
            loggedIn: true,
            username: req.session.user,
            event: allFavorites,
            favorited: true
          });
          }else{
            throw "Was not able to unregister for event";
          }
          return;
        }
      }
        let allFavorites = await events.getFavorites(req.session.user);
        res.render("favorited", {
          title: "Favorited Events",
          loggedIn: true,
          username: req.session.user,
          event: allFavorites,
          favorited: false
        });
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
      let cancel = await events.cancelEvent(req.session.user, req.params.id);
      let answer = await events.getEventById(req.params.id);
      if(cancel.success == true){
        //res.render('partials/favorite', {layout: null, favorite: favorited.favoritedEventSwitched});    //ajax
        let allCreated = await events.getEventsCreatedBy(req.session.user);
        res.render("createdEvents", {
          title: "Created Events",
          loggedIn: true,
          username: req.session.user,
          event: allCreated,
          cancel: answer.cancelled
        });
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
      let uncancel = await events.uncancelEvent(req.session.user, req.params.id);
      let answer = await events.getEventById(req.params.id);
      if(uncancel.success == true){
        let allCreated = await events.getEventsCreatedBy(req.session.user);
        res.render("createdEvents", {
          title: "Created Events",
          loggedIn: true,
          username: req.session.user,
          event: allCreated,
          cancel: answer.cancelled
        });
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
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const e = require("express");
const users = data.users;
const events = data.events;
const helpers = require("../helpers");
const xss = require("xss");

const maxImageSizeMB = 5;

  router
  .route('/search')
  .post(async (req, res) => {
    try{
      helpers.errorIfNotProperString(xss(req.body.search));

      if(req.body.search.length < 3){
        throw "Search term must be at least 2 characters"
      }
      req.body.search = req.body.search.trim();
      if (req.session.user){
        const userData = await users.getUserData(req.session.user);
        const upcomingEvents = await events.searchUpcomingEvents(userData.college, xss(req.body.search));
        res.render("homepage", {
          loggedIn: true,
          username: req.session.user,
          college: userData.college,
          event: upcomingEvents,
          searchTerm: xss(req.body.search)
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

      eventInfo.fmtStartTime = (new Date(eventInfo.startTime.getTime() - eventInfo.startTime.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
      eventInfo.fmtEndTime = (new Date(eventInfo.endTime.getTime() - eventInfo.endTime.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);

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
        res.redirect("/events/" + req.params.id);
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
    // using a post instead of patch because of HTML form behavior
    try{
      if(!req.session.user){
        res.redirect("/login");
        return;
      }
      if(!req.params.id) throw "Event ID not given";
      // TODO: check if user has permission to edit
      const createData = req.body;
      
      if(!createData.eventName || !createData.location || !createData.startTime || !createData.endTime || !createData.tags 
          || !createData.description || !createData.capacity) throw "An input is missing!";
          helpers.errorIfNotProperString(xss(createData.eventName), "eventName");
          helpers.errorIfNotProperString(xss(createData.location), "location");
          helpers.errorIfNotProperDateTime(xss(createData.startTime));
          helpers.errorIfNotProperDateTime(xss(createData.endTime));
          if (Date.parse(createData.startTime) >= Date.parse(createData.endTime)) {
            throw `StartTime can't after endTime`;
          }

          

          createData.tags = createData.tags.split(",");
          for (let i=0;i<createData.tags.length;i++){//goes through tags array and checks each to see if it s a valid string and trims them
            createData.tags[i] = createData.tags[i].trim();
            helpers.errorIfNotProperString(createData.tags[i], "tags");
            helpers.errorIfNotProperString(createData.tags[i], "tag "+(i+1));
          }

          helpers.errorIfNotProperString(xss(createData.description), "description");
        
          helpers.errorIfStringIsNotNumber(xss(createData.capacity));
          capacity = parseFloat(createData.capacity);
        
          if (capacity < 1 || capacity % 1 > 0) {
            throw `Invalid Capacity provided`;
          }

          let image = null;

          if(req.files){
            image = req.files.image;
            console.log("got an image");
        
            if (image.size > (1024 * 1024 * maxImageSizeMB)) {
              throw `Image size must be below ${maxImageSizeMB} MB`;
            }
          
            if (!image.mimetype.includes("image")) {
              throw `File must be an image`;
            }
          }

      //rest of error checking all input

      
    let event = await events.editEvent(
      req.params.id,
      xss(createData.eventName), 
      xss(createData.location), 
      xss(createData.startTime), 
      xss(createData.endTime), 
      xss(createData.tags), 
      xss(createData.description), 
      xss(createData.capacity), 
      image);

    if(event.success){
      res.redirect("/events/" + req.params.id);
    }
    else{
        res.status(500).render("errorPage", {
          error: "Internal Server Error. Try Again"
        });
      }

  }catch(e){
      res.status(400).render("errorPage", {
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
        res.redirect("/events/" + req.params.id);
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
        res.redirect("/events/" + req.params.id);
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
        res.redirect("/events/" + req.params.id);
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
        res.redirect("/events/" + req.params.id);
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
        res.redirect("/events/" + req.params.id);
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
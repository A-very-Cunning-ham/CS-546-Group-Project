const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const users = data.users;
const events = data.events;
const helpers = require("../helpers");
const { createUser } = require("../data/users");

const maxImageSizeMB = 16;

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    //the main page
    try{
      if (req.session.user){
        const userData = await users.getUserData(req.session.user);
        // console.log(userData);
        const upcomingEvents = await events.getUpcomingEvents(userData.college);
        // console.log(upcomingEvents);
        res.render("homepage", {
          loggedIn: true,
          username: req.session.user,
          college: userData.college,
          event: upcomingEvents
        });
      } else{
        const upcomingEvents = await events.getUpcomingEvents();
        res.render("homepage", {
          title: "Homepage",
          loggedIn: false,
          event: upcomingEvents
        });
      }
    }
    catch (e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  })

router
  .route('/login')
  .get(async (req, res) => {
    //if user is already logged in, then we redirect them to the homepage. Else we render the login page
    try{
      if (req.session.user){
        res.redirect("/");
      } else{
        res.render("userLogin", {
          title: "Login",
          loggedIn: false
        });
      }
    }
    catch (e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  })
  .post(async (req, res) => {
    //when user tries to log in, if successful we send them to homepage. If username or password incorrect, we render the login page again with an error
    try{
      const {usernameInput, passwordInput} = req.body;
      helpers.errorIfNotProperUserName(usernameInput);
      helpers.errorIfNotProperPassword(passwordInput);
      let output = await users.checkUser(usernameInput, passwordInput);
      if (output.authenticatedUser==true){
        req.session.user = output.username;
        res.redirect("/");
      }
    } catch (e){
      res.status(400);
      res.render("userLogin", {
        title: "Login",
        loggedIn: false,
        error: "Username or password is incorrect"
      });
    }
  })

router
  .route('/register')
  .get(async (req, res) => {
    //if user is already logged in, then we redirect them to the homepage. Else we render the register page
    try{
      if (req.session.user){
        res.redirect("/");
      } else{
        res.render("userRegister", {
          title: "Register",
          loggedIn: false
        });
      }
    }
    catch (e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  })
  .post(async (req, res) => {
    //code here for POST
		try {
			//when user tries to register, if successful we send them to the login page. Else we render registration page with error
			const {
				usernameInput,
				passwordInput,
				firstnameInput,
				lastnameInput,
				collegeInput,
			} = req.body;
			helpers.errorIfNotProperUserName(usernameInput, "username");
			helpers.errorIfNotProperPassword(passwordInput, "password");
			let output = await users.createUser(
				usernameInput,
				passwordInput,
				firstnameInput,
				lastnameInput,
				collegeInput
			);
      if (output.userInserted == true){
        res.redirect("/login");
      }
      else{
        res.status(500);
        res.render("userRegister", {
          title: "Register",
          loggedIn: false,
          error: "Internal Server Error"
        });
      }
      
    } catch (e) {
      res.status(400);
      res.render("userRegister", {
        title: "Register",
        loggedIn: false,
        error: e
      });
    }
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //when user tries to logout, if already logged out then we redirect to login page. Else we render logout page
    try{
      if (!req.session.user){
        res.redirect("/login");
        return;
      }
      req.session.destroy();
      res.render("logout", {
        title: "Register",
        loggedIn: false
      });
    } catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  });

router
  .route('/create')
  .get(async (req, res) => {
    //if not logged in, redirect to login?
    //if any error w input, render form again with error message
    //if successful, render GET /created
    try{
        if(!req.session.user){
          res.redirect("/login");
        }else{
          res.render("createEvent",{
            title: "Create An Event",
            username: req.session.user,
            loggedIn: true
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
    // TODO: protect this route!
    try{
        if(!req.session.user){
          res.redirect("/login");
          return;
        }
        const createData = req.body;
        console.log(createData);
        if(!createData.eventName || !createData.location || !createData.startTime || !createData.endTime || !createData.tags 
            || !createData.description || !createData.capacity) throw "An input is missing!";
            helpers.errorIfNotProperString(createData.eventName, "eventName");
            helpers.errorIfNotProperString(createData.location, "location");
            helpers.errorIfNotProperDateTime(createData.startTime);
            helpers.errorIfNotProperDateTime(createData.endTime);
            if (Date.parse(createData.startTime) >= Date.parse(createData.endTime)) {
              throw `StartTime can't after endTime`;
            }

            let image = req.files.image;

            createData.tags = createData.tags.split(",");
            for (let i=0;i<createData.tags.length;i++){//goes through tags array and checks each to see if it s a valid string and trims them
              createData.tags[i] = createData.tags[i].trim();
              helpers.errorIfNotProperString(createData.tags[i], "tags");
              helpers.errorIfNotProperString(createData.tags[i], "tag "+(i+1));
            }

            helpers.errorIfNotProperString(createData.description, "description");
          
            helpers.errorIfStringIsNotNumber(createData.capacity);
            capacity = parseFloat(createData.capacity);
          
            if (capacity < 1 || capacity % 1 > 0) {
              throw `Invalid Capacity provided`;
            }
          
            if (image.size > (1024 * 1024 * maxImageSizeMB)) {
              throw `Image size must be below ${maxImageSizeMB} MB`;
            }
          
            if (!image.mimetype.includes("image")) {
              throw `File must be an image`;
            }
        //rest of error checking all input

        try{
          let event = await events.createEvent(
            createData.eventName, 
            createData.location, 
            createData.startTime, 
            createData.endTime, 
            req.session.user, 
            createData.tags, 
            createData.description, 
            createData.capacity, 
            image);
          if(event.eventInserted == true){
            res.redirect("/created");
          }
          else{
              res.status(500).render("createEvent", {
                error: "Internal Server Error Try Again"
              });
            }
      }catch(e){
        console.error(e);
          res.status(400).render("createEvent", {
            title: "Created Events", loggedIn: true,
            username: req.session.user,
            error: e
          });
      }


    }catch(e){
        res.status(400).render("createEvent", {
          title: "Created Events", loggedIn: true,
          username: req.session.user,
          error: e
        });
    }

  });

router
  .route('/registered')
  .get(async (req, res) => {
    try{
      if(req.session.user){
        //function from events.js to get all events that a user is registered for, then pass in result to render page
        let registered = await events.getRegistered(req.session.user);
        res.render("registeredEvents", {
          title: "Registered Events",
          loggedIn: true,
          username: req.session.user,
          event: registered 
        });
      }
      else{
        res.redirect("/login");
      }
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
    }
  })
  .post(async (req,res) => {
    try{
      if(!req.session.user){
        res.redirect("login");
      }
      if(!req.params.id) throw "Event ID not given";
      let del = await events.deleteEvent(req.params.id);
      res.redirect("/created");
    }catch(e){
      res.status(400).render("errorPage",{
        title: "Error",
        error: e
      });
      }
  });


  router
    .route('/created')//"Your Events"
    .get(async (req, res) => {
      try{
        if(req.session.user){
          //function to get all the events a user has created, then pass in result to render page

          // TODO: load this data
          let createdEvents = await events.getEventsCreatedBy(req.session.user);

          res.render("createdEvents", {
            title: "Created Events",
            loggedIn: true,
            event: createdEvents,
            username: req.session.user,
          });
        }
        else{
          res.redirect("/login");
        }
      }catch(e){
        res.status(400).render("errorPage",{
          title: "Error",
          error: e
        });
      }
    });

  router
    .route('/created/:id')
    .get(async (req, res) => {
      try{
        if(!req.session.user){
          res.redirect("/login");
        }
        if(!req.params.id) throw "Event ID not given";
        let info = await events.getEventById(req.params.id);   
        res.render("eventId", {
          title: "Event Details",
          loggedIn: true,
          username: req.session.user,
          info: info
        });
      }catch(e){
        res.status(400).render("errorPage",{
          title: "Error",
          error: e
        });
      }
    })
    .post(async (req,res) => {    
      try{//TODO: currently deletes the event
        if(!req.session.user){
          res.redirect("login");
        }
        if(!req.params.id) throw "Event ID not given";
        //let del = await events.deleteEvent(req.params.id);
        res.redirect("/created");
      }catch(e){
        res.status(400).render("errorPage",{
          title: "Error",
          error: e
        });
      }
    });

  router
    .route('/favorited')
    .get(async (req, res) => {
      try{
        if(!req.session.user){
          res.redirect("/login");
        }
        let favorited = await events.getFavorites(req.session.user);
        res.render("favorited", {
          title: "Favorited Events",
          loggedIn: true,
          username: req.session.user,
          event: favorited
        });
      }catch(e){
        res.status(400).render("errorPage",{
          title: "Error",
          error: e
        });
      }
    });

module.exports = router;
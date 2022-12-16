const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const users = data.users;
const events = data.events;


router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    //the main page
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
          title: "userLogin"
        });
      }
    }
    catch (e){
      res.status(400);
    }
  })
  .post(async (req, res) => {
    //when user tries to log in, if successful we send them to homepage. If username or password incorrect, we render the login page again with an error
    try{
      // TODO: add validation
      
      let output = await users.checkUser(usernameInput, passwordInput);
      if (output.authenticatedUser==true){
        req.session.user = usernameInput;
        res.redirect("/");
      }
    } catch (e){
      res.status(400);
      res.render("userLogin", {
        title: "userLogin",
        error: e
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
          title: "userRegister"
        });
      }
    }
    catch (e){
      res.status(400);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    try{//when user tries to register, if successful we send them to the login page. Else we render registration page with error
      const {usernameInput, passwordInput} = req.body;
      let output = await users.createUser(usernameInput, passwordInput);
      if (output.userInserted == true){
        res.redirect("/login");
      }
      else{
        res.status(500);
        res.render("userRegister", {
          title: userRegister,
          error: "Internal Server Error"
        });
      }
    } catch (e) {
      res.status(400);
      res.render("userRegister", {
        title: "userRegister",
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
      res.render("logout");
    } catch(e){
      res.status(400);
    }
  });

router
  .route('/create')
  .get(async (req, res) => {
    try{
        if(req.session.user){
            res.render("createEvent");
        }else{
            res.redirect("/login");
            //maybe add something for error message in "/login" so that when user is redirected, they know why. Or we could render the page with the error here.
        }
    }catch(e){
        res.status(400);
    }
  })
  .post(async (req, res) => {
    const createData = req.body;
    try{
        if(!createData.eventName || !createData.location || !createData.startTime || !createData.endTime || !createData.postedBy || !createData.tags 
            || !createData.description || !createData.capacity || !createData.college) throw "An input is missing!";
        //rest of error checking all input
    }catch(e){
        res.status(400).render("createEvent", {error: e});
    }

    try{
        let event = await events.createEvent(createData.eventName, createData.location, createData.startTime, createData.endTime, createData.postedBy, createData.tags, createData.description, createData.capacity, createData.college);
        if(event.userInserted == true){
            res.render("createdEvents", {eventName: createData.eventName, location: createData.location, startTime: createData.startTime, endTime: createData.endTime, postedBy: createData.postedBy, tags: createData.tags, 
              description: createData.description, capacity: createData.capacity, college: createData.college});
        }
        else{
            res.status(500).render("createEvent", {
              error: "Internal Server Error Try Again"
            });
          }
    }catch(e){
        res.status(400).render("createEvent", {error: e});
    }
  });

router
  .route('/registered')
  .get(async (req, res) => {
    try{
      if(req.session.user){
        //function from events.js to get all events that a user is registered for, then pass in result to render page
        res.render("registeredEvents");
      }
      else{
        res.redirect("/login");
        //maybe send an error message somehow
      }
    }catch(e){
      res.status(400);
    }
  })
  .post(async (req,res) => {
    try{
      if(req.session.user){
      }
      else{
        res.redirect("login");
        //maybe send error message
      }
    }catch(e){
        res.status(400);
      }
    try{
      if(!req.params.id) throw "Event ID not given";
      //rest of error checking
    }catch(e){
      res.status(400);
    }
    try{
      let del = await events.deleteEvent(req.params.id);
      res.redirect("/created");
    }catch(e){
      res.status(400);
    }
  });


  router
    .route('/created')
    .get(async (req, res) => {
      try{
        if(req.session.user){
          //function to get all the events a user has created, then pass in result to render page
          res.render("createdEvents");
        }
        else{
          res.redirect("/login");
          //maybe send an error message somehow
        }
      }catch(e){
        res.status(400);
      }
    });

  router
    .route('/created/:id')
    .get(async (req, res) => {
      if(!req.session.user){
        res.redirect("/login");
        //maybe send an error message somehow
      }
      try{
        if(!req.params.id) throw "Event ID not given";
        //rest of error checking
      }catch(e){
        res.status(400);
      }
      try{
        let info = await events.getEventById(req.params.id);   
        res.render("eventId", {info: info});
      }catch(e){
        res.status(400);
      }
    })
    .post(async (req,res) => {    
      try{
        if(req.session.user){

        }
        else{
          res.redirect("login");
          //maybe send error message
        }
      }catch(e){
          res.status(400);
        }
      try{
        if(!req.params.id) throw "Event ID not given";
        //rest of error checking
      }catch(e){
        res.status(400);
      }
      try{
        let del = await events.deleteEvent(req.params.id);
        res.redirect("/created");
      }catch(e){
        res.status(400);
      }
    });

  router
    .route('/favorited')
    .get(async (req, res) => {
      if(!req.session.user){
        res.redirect("/login");
        //maybe send an error message somehow
      }
      try{
        //let favorited = await users.getFavorited
        res.render("favorited", {favorited: favorited});
      }catch(e){
        res.status(400);
      }
    });

module.exports = router;
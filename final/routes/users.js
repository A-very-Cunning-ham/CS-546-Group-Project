
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const users = data.users;

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
      TODO: add validation
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
  })

module.exports = router;
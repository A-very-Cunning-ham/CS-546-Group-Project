const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const { getEventById } = require("../data/events");
const xss = require("xss");
const users = data.users;
const events = data.events;
const comments = data.comments;
const helpers = require("../helpers");

router
    .route('/:eventId')
    .post(async (req, res) => {    
        try{
            if(!req.session.user){
                res.render("userLogin",{
                    title: "Login",
                    loggedIn: false,
                    error: "Please log in first"
                });
            }
        }catch(e){
            res.status(400);
        }
        try{
            //ec
            const {comment} = req.body;
            if(!req.params.eventId) throw "EventId not provided";
            if(!comment) throw "Input not provided";
            helpers.errorIfNotProperID(req.params.eventId, 'eventID');
            //helpers.errorIfNotProperName(req.session.user);
            //let user = await users.getUserData(req.session.user);

            req.params.eventId = req.params.eventId.trim();
            // let event = await event_collection_c.findOne({ _id: ObjectId(req.params.eventId) });
            // if (!event) throw `No Event present with id: ${req.params.eventId}`;

            //helpers.errorIfNotProperID(commentData.userId, 'userID');
            //commentData.userId = commentData.userId.trim();
            //let user = await user_collection_c.findOne({ _id: ObjectId(commentData.userId) });
            //if (!user) throw `No user present with id: ${commentData.userId}`;
            //
            //const { comment } = commentData;
            const newComment = await comments.createComment(req.params.eventId, req.session.user, xss(comment));
            //const getEvent = await events.getEventById(req.params.id);
            res.render('partials/comment', {layout: null, loggedIn: true, title: "Event Details", commenter: req.session.user, comment: comment, url: req.params.eventId});     //ajax
            //res.render("eventDetails", {info: getEvent});
        }catch(e){
            console.log(e);
            res.status(400);
        }
    });

    module.exports = router;
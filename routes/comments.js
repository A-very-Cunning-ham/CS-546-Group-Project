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
                return;
            }
            //TODO check validation - I have no idea if this covers all necessary cases
            const {comment} = req.body;
            if(!req.params.eventId) throw "EventId not provided";
            if(!comment) throw "Input not provided";
            helpers.errorIfNotProperID(req.params.eventId, 'eventID');

            // req.params.eventId = req.params.eventId.trim();
            // let event = await event_collection_c.findOne({ _id: ObjectId(req.params.eventId) });
            // if (!event) throw `No Event present with id: ${req.params.eventId}`;

            // let user = await user_collection_c.findOne({ _id: ObjectId(commentData.userId) });
            // if (!user) throw `No user present with id: ${commentData.userId}`;hi

            const newComment = await comments.createComment(req.params.eventId, req.session.user, xss(comment));
            currTime = new Date();
            res.render('partials/comment', {layout: null, loggedIn: true, title: "Event Details", commenter: req.session.user, comment: comment, time: currTime});
        }catch(e){
            res.status(400).render("errorPage",{
                title: "Error",
                error: e
              });
        }
    });

    module.exports = router;
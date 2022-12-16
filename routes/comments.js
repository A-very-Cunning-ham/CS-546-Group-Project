const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const { getEventById } = require("../data/events");
const xss = require("xss");
const users = data.users;
const events = data.events;
const comments = data.comments;

router
    .route('/:eventId')
    .post(async (req, res) => {    
        try{
            if(req.session.user){

            }
            else{
                res.redirect("/login");
                //maybe send error message
            }
        }catch(e){
            res.status(400);
        }
        const commentData = req.body;
        try{
            //ec
            if(!req.params.eventId) throw "EventId not provided";
            if(!commentData.comment) throw "Input not provided";
            helpers.errorIfNotProperID(req.params.eventId, 'eventID');
            helpers.errorIfNotProperName(req.session.user);
            req.params.eventId = req.params.eventId.trim();
            let event = await event_collection_c.findOne({ _id: ObjectId(req.params.eventId) });
            if (!event) throw `No Event present with id: ${req.params.eventId}`;

            //helpers.errorIfNotProperID(commentData.userId, 'userID');
            //commentData.userId = commentData.userId.trim();
            //let user = await user_collection_c.findOne({ _id: ObjectId(commentData.userId) });
            //if (!user) throw `No user present with id: ${commentData.userId}`;
            //
        }catch(e){
            res.status(400);
        }
        try{
            await getEventById(req.params.eventId);
        }catch(e){
            res.status(400);
        }
        try{
            const { comment } = commentData;
            const newComment = await comments.createComment(req.params.eventId, req.session.user, xss(comment));
            const getEvent = await events.getEventById(req.params.id);
            res.render('partials/comment', {layout:null, ...getEvent});     //ajax
            //res.render("eventDetails", {info: getEvent});
        }catch(e){
            res.status(400);
        }
    });

    module.exports = router;
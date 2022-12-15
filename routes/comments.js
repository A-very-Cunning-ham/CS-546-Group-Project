const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const { getEventById } = require("../data/events");
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
            if(!commentData.userId || !commentData.comment) throw "Input not provided";
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
            const { userId, comment } = commentData;
            const newComment = await comments.createComment(req.params.eventId, userId, comment);
            const getEvent = await events.getEventById(req.params.id);
            res.render("eventDetails", {info: getEvent});
        }catch(e){
            res.status(400);
        }
    });
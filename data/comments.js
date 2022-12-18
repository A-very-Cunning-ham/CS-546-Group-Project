const mongoCollections = require('../config/mongoCollections');
const users = require('./users');
const user_collection = mongoCollections.user_collection;
const event_collection = mongoCollections.event_collection;
const { ObjectId } = require('mongodb');

const helpers = require('../helpers');
const eventData = require('./events');

const createComment = async (eventID, userName, comment) => {
	//TODO check to see if we need the time for the comment?
	const user_collection_c = await user_collection();
	const event_collection_c = await event_collection();

	if (!comment) throw `Comment body empty`;

	//check if event exists
	helpers.errorIfNotProperID(eventID, 'eventID');
	eventID = eventID.trim();
	let event = await event_collection_c.findOne({ _id: ObjectId(eventID) });
	if (!event) throw `No Event present with id: ${eventID}`;

	//check if user exists
	helpers.errorIfNotProperUserName(userName, 'userName');
	// userID = userID.trim();
	let user = await user_collection_c.findOne({ username: userName });
	if (!user) throw `No user present with username: ${userName}`;

	let commentID = new ObjectId();
	let newComment = {
		_id: commentID,
		commentDate: new Date(),
		userName: userName,
		body: comment,
	};

	let res = await event_collection_c.updateOne(
		{ _id: ObjectId(eventID) },
		{ $push: { comments: newComment } }
	);

	if (res.acknowledged == false) {
		throw `Server Error`;
	} else {
		return newComment;
	}
};

const getAllCommentForEvent = async (eventID) => {
	// FIXME: will this even be used? we will just be showing comments on the event details page where this data is already returned
	const event_collection_c = await event_collection();

	//check if event exists
	helpers.errorIfNotProperID(eventID, 'eventID');
	eventID = eventID.trim();
	let event = await event_collection_c.findOne({ _id: ObjectId(eventID) });
	if (!event) throw `No Event present with id: ${eventID}`;

	let commentList = event.comment;
	commentList = commentList.map(function (val) {
		val._id = val._id.toString();
		return val;
	});

	return commentList;
};

module.exports = { createComment, getAllCommentForEvent };

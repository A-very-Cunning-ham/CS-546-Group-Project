const helpers = require('../helpers');
const users = require("./users");
const mongoCollections = require("../config/mongoCollections");
const user_collection = mongoCollections.user_collection;
const event_collection = mongoCollections.event_collection;
const { ObjectId } = require("mongodb");

const maxImageSizeMB = 5;

const createEvent = async (
	eventName,
	location,
	startTime,
	endTime,
	postedBy,
	tags,
	description,
	capacity,
	imageData
) => {
	//
	const event_collection_c = await event_collection();

	helpers.errorIfNotProperString(eventName, "eventName");
	helpers.errorIfNotProperString(location, "location");
	helpers.errorIfNotProperDateTime(startTime);
	helpers.errorIfNotProperDateTime(endTime);
	if (Date.parse(startTime) >= Date.parse(endTime)) {
		throw `StartTime can't after endTime`;
	}

	//check if user exists
	helpers.errorIfNotProperUserName(postedBy, "postedBy");
	postedBy = postedBy.trim();
	let user = await users.getUserData(postedBy);
	if (!user) throw `No user present with userName: ${postedBy}`;

	if (tags) {
		helpers.errorIfNotProperString(tags, "Tags");
		tags = tags.split(",");
		// TODO: trim whitespace
	}
	helpers.errorIfNotProperString(description, "description");


	let userData = await users.getUserData(postedBy);
	let college = userData.college;


	helpers.errorIfStringIsNotNumber(capacity);
	capacity = parseFloat(capacity);

	if (capacity < 1 || capacity % 1 > 0) {
		throw `Invalid Capacity provided`;
	}

	if (imageData.size > 1024 * 1024 * maxImageSizeMB) {
		throw `Image size must be below ${maxImageSizeMB} MB`;
	}

	if (!imageData.mimetype.includes("image")) {
		throw `File must be an image`;
	}

	let new_event = {
		eventName: eventName,
		location: location,
		startTime: startTime,
		endTime: endTime,
		postedBy: postedBy,
		tags: tags,
		description: description,
		capacity: capacity,
		numUserRegistered: 0,
		usersRegistered: [],
		numFavorite: 0,
		favoriteUsers: [],
		image: imageData,
		college: college,
		comments: [],
	};

	const insertInfo = await event_collection_c.insertOne(new_event);

	if (insertInfo.insertedCount === 0) {
		throw `Server Error`;
	} else {
		return { eventInserted: true };
	}
};

const getEventById = async (id) => {
	if (!id) throw "You must provide an ID to search for";
	if (typeof id !== "string") throw "ID must be a string";
	if (id.trim().length === 0)
		throw "ID cannot be an empty string or just spaces";
	id = id.trim();
	if (!ObjectId.isValid(id)) throw "invalid object ID";

	const event_collection_c = await event_collection();
	const event = await event_collection_c.findOne({ _id: ObjectId(id) });
	if (!event) throw "No event with that id";

	event._id = event._id.toString();

	return event;
};

const getUpcomingEvents = async (college) => {
	helpers.errorIfNotProperString(college, "College");

	college = college.trim();

	const event_collection_c = await event_collection();
	const events = await event_collection_c.find({
		college: college,
		// startTime: { $gte: new Date() },
	}).toArray();

	// console.log(events);

	if (!events) throw "No events found";

	const res = events.map((obj) => {
		obj.image.data = obj.image.data.toString('base64');
		return obj;
	  });

	//   TODO: check if _id needs to be converted to string

	return res;
};

const deleteEvent = async (id) => {
	if (!id) throw "You must provide an ID to search for";
	if (typeof id !== "string") throw "ID must be a string";
	if (id.trim().length === 0)
		throw "ID cannot be an empty string or just spaces";
	id = id.trim();
	if (!ObjectId.isValid(id)) throw "invalid object ID";

	const event_collection_c = await event_collection();
	const event = await getEventById(id);
	const deletionInfo = await event_collection.deleteOne({_id: ObjectId(id)});

	if(deletionInfo.deletedCount === 0){
		throw "Could not delete event with id of " + id;
	}
	return `${event.eventName} has been succesfully removed`;

};

const registerForEvent = async (username, eventID) => {
	//TODO: check for conflicting events
	helpers.errorIfNotProperUserName(username);
	const event_collection_c = await event_collection();
	helpers.errorIfNotProperID(eventID, 'eventID');
	eventID = eventID.trim();
	let event = await event_collection_c.findOne({ _id: ObjectId(eventID) });
	if (!event) throw `No Event present with id: ${eventID}`;

	let res = await event_collection_c.updateOne(
		{ _id: ObjectId(eventID) },
		{ $push: { usersRegistered: username } }
	);

	if (res.acknowledged == false) {
		throw `Server Error`;
	} else {
		return { userInserted: true };
	}
}

const favoritedEventsSwitch = async (username, eventID) => {
	helpers.errorIfNotProperUserName(username);
	const event_collection_c = await event_collection();
	const user_collection_c = await user_collection();
	helpers.errorIfNotProperID(eventID, 'eventID');
	eventID = eventID.trim();
	let event = await event_collection_c.findOne({ _id: ObjectId(eventID) });
	if (!event) throw `No Event present with id: ${eventID}`;

	let user = await user_collection_c.findOne({username: username});
	if (!user) throw "Could not find user";

	let res = "";

	if (user.favoritedEvents.includes(eventID)){
		res = await user_collection_c.updateOne(
			{ username: username },
			{ $pull: { favoritedEvents: eventID } }
		);
	} else{
		res = await user_collection_c.updateOne(
			{ username: username },
			{ $push: { favoritedEvents: eventID } }
		);
	}

	if (res.acknowledged == false) {
		throw `Server Error`;
	} else {
		return { favoritedEventSwitched: true };
	}
}

module.exports = {
	createEvent, 
	getEventById, 
	getUpcomingEvents,
	registerForEvent,
	favoritedEventsSwitch,
	deleteEvent
};

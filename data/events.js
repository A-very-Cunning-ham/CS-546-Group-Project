const helpers = require('../helpers');
const users = require("./users");
const mongoCollections = require("../config/mongoCollections");
const user_collection = mongoCollections.user_collection;
const event_collection = mongoCollections.event_collection;
const { ObjectId } = require("mongodb");
const constructorMethod = require('../routes');

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
		throw `StartTime can't come after endTime`;
	}

	//check if user exists
	helpers.errorIfNotProperUserName(postedBy, "postedBy");
	postedBy = postedBy.toLowerCase().trim();
	let user = await users.getUserData(postedBy);
	if (!user) throw `No user present with userName: ${postedBy}`;

	if (tags) {
		for (let i=0;i<tags.length;i++){
			tags[i] = tags[i].trim();
			helpers.errorIfNotProperString(tags[i], "tags");
		  }
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
		startTime: new Date(startTime),
		endTime: new Date(endTime),
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

	const event_collection_c = await event_collection();
	if(college){
		helpers.errorIfNotProperString(college, "College");
		college = college.trim();
	
		var events = await event_collection_c.find({
			college: college,
			startTime: { $gte: new Date() },
		}).toArray();
	}else{
		var events = await event_collection_c.find({
			startTime: { $gte: new Date() },
		}).toArray();

	}


	if (!events) throw "No events found";

	const res = events.map((obj) => {
		obj.image.data = obj.image.data.toString('base64');
		return obj;
	  });

	//   TODO: check if _id needs to be converted to string

	return res;
};

const searchUpcomingEvents = async (college, searchTerm) => {
	helpers.errorIfNotProperString(searchTerm, "Search Term");
	searchTerm = searchTerm.trim().toLowerCase();

	if(searchTerm.length < 3){
		throw "Search term must be at least 2 characters"
	}

	
	// college parameter checking is handled by getUpcomingEvents()
	let upcomingEvents = await getUpcomingEvents(college);

	const res = upcomingEvents.filter(event => 
		event.eventName.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm)
		);

	if(!res){
		throw "No matching results found";
	}

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
	const deletionInfo = await event_collection_c.deleteOne({_id: ObjectId(id)});

	if(deletionInfo.deletedCount === 0){
		throw "Could not delete event with id of " + id;
	}
	return `${event.eventName} has been succesfully removed`;

};

const registerForEvent = async (username, eventID) => {
	//TODO: check for conflicting events
	helpers.errorIfNotProperUserName(username);
	username = username.trim().toLowerCase();
	const event_collection_c = await event_collection();
	const user_collection_c = await user_collection();
	helpers.errorIfNotProperID(eventID, 'eventID');
	eventID = eventID.trim();
	let event = await event_collection_c.findOne({ _id: ObjectId(eventID) });
	if (!event) throw `No Event present with id: ${eventID}`;

		// TODO: test these conditions
		let alreadyRegistered = await getRegistered(username);
		

		for(let toCompareEvent of alreadyRegistered){

			if(event._id == toCompareEvent._id){
				console.log("already registered for this event")
				throw "Already registered for this event";
			}

			if((event.startTime <= toCompareEvent.endTime) && (event.endTime >= toCompareEvent.startTime)){
				console.log("conflicting events")
				throw "Can't register for events with overlapping times";
			}
		}

		if(event.numUserRegistered >= event.capacity){
			console.log("Capacity reached")
			throw "Event capacity already reached, can't register";
		}
		console.log("no errors")

	// TODO: maybe use a transaction here to ensure collections stay in sync
	let eventUpdated = await event_collection_c.updateOne(
		{ _id: ObjectId(eventID) },
		{$push: { usersRegistered: username } ,
		 $inc: { numUserRegistered: 1}}
	);

	let userUpdated = await user_collection_c.updateOne(
		{ username: username },
		{$push: { eventsRegistered: eventID }}
	);

	if (eventUpdated.acknowledged == false || userUpdated.acknowledged == false) {
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

const getFavorites = async (username) => {
	try {
		helpers.errorIfNotProperUserName(username, "username");
	} catch (e) {
		throw `Invalid username`;
	}

	try{
		let user = await users.getUserData(username);
	
		if(!user.favoriteEvents){
			throw "User has no favorite events";
		}
	
		const res = await Promise.all(user.favoriteEvents.map(async (obj) => {
			obj = obj.toString();

			let event = await getEventById(obj);
			event.image.data = event.image.data.toString('base64');

			return event;
		  }));

		  if (!res) throw "No events found";

		return res;

	}catch(e){
		throw e;
	}

};

const getRegistered = async (username) => {
	try {
		helpers.errorIfNotProperUserName(username, "username");
	} catch (e) {
		throw `Invalid username`;
	}

	try{
		let user = await users.getUserData(username);
		
		// TODO: check if this needs to check the length
		if(!user.eventsRegistered){
			throw "User has no favorite events";
		}
	
		const res = await Promise.all(user.eventsRegistered.map(async (obj) => {
			obj = obj.toString();

			let event = await getEventById(obj);
			event.image.data = event.image.data.toString('base64');

			return event;
		  }));

		  if (!res) throw "No events found";

		return res;

	}catch(e){
		throw e;
	}

};

const getEventsCreatedBy = async (username) => {
	try {
		helpers.errorIfNotProperUserName(username, "username");
	} catch (e) {
		throw `Invalid username`;
	}

	try{
		const event_collection_c = await event_collection();
		console.log(username);
		username = username.toLowerCase().trim();
		const events = await event_collection_c.find({
			postedBy: username
		}).toArray();
	
		if (!events) throw "No events found";
	
		const res = events.map((obj) => {
			obj.image.data = obj.image.data.toString('base64');
			return obj;
		  });
		
		return res;

	}catch(e){
		throw e;
	}

};

module.exports = {
	createEvent, 
	getEventById, 
	getUpcomingEvents,
	registerForEvent,
	favoritedEventsSwitch,
	deleteEvent,
	getFavorites,
	getRegistered,
	getEventsCreatedBy,
	searchUpcomingEvents
};

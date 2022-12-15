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
	}
	helpers.errorIfNotProperString(description, "description");

	helpers.errorIfNotProperString(college, 'college');
	//college = user.college;

	helpers.errorIfStringIsNotNumber(capacity);
	capacity = parseFloat(capacity);

	if (capacity < 1 || capacity % 1 > 0) {
		throw `Invalid Capacity provided`;
	}

	if (imageData.size > 1024 * maxImageSizeMB) {
		throw `Image size must be below ${maxImageSizeMB} MB`;
	}

	if (!imageData.mimetype.contains("image")) {
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
		image: image.data,
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
		startTime: { $gte: new Date() },
	});

	if (!events) throw "No events found";

	//   TODO: check if _id needs to be converted to string

	return events;
};

module.exports = {createEvent, getEventById, getUpcomingEvents};

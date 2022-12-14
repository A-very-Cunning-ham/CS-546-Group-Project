const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers");
const user_collection = mongoCollections.user_collection;
const bcrypt = require("bcrypt");

// TODO: increase salt rounds for better security
const saltRounds = 4;

const createUser = async (username, password, firstName, lastName, college) => {
	helpers.errorIfNotProperUserName(username, "username");
	helpers.errorIfNotProperPassword(password, "password");
	helpers.errorIfNotProperName(firstName, "firstName");
	helpers.errorIfNotProperName(lastName, "lastName");

	username = username.trim().toLowerCase();
	password = password.trim();

	const user_collection_c = await user_collection();

	//duplicate check
	let dup_user = await user_collection_c.findOne({ username: username });

	if (dup_user) {
		throw `there is already a user with that username`;
	}

	let hashed_password = await bcrypt.hash(password, saltRounds);

	let new_user = {
		username: username,
		password: hashed_password,
		firstName: firstName,
		lastName: lastName,
		college: college,
		favoriteEvents: [],
		eventsRegistered: [],
	};

	const insertInfo = await user_collection_c.insertOne(new_user);

	if (insertInfo.insertedCount === 0) {
		throw `Server Error`;
	} else {
		return { userInserted: true };
	}
};

const checkUser = async (username, password) => {
	//
	try {
		helpers.errorIfNotProperUserName(username, "username");
	} catch (e) {
		throw `Either the username or password is invalid`;
	}

	try {
		helpers.errorIfNotProperPassword(password, "password");
	} catch (e) {
		throw `Either the username or password is invalid`;
	}

	const user_collection_c = await user_collection();
	username = username.toLowerCase();
	let user = await user_collection_c.findOne({ username: username });
	if (!user) throw `Either the username or password is invalid`;

	if (await bcrypt.compare(password, user.password)) {
		return { authenticatedUser: true, username: user.username  };
	} else {
		throw `Either the username or password is invalid`;
	}
};

const getUserData = async (username) => {
	//
	try {
		helpers.errorIfNotProperUserName(username, "username");
	} catch (e) {
		throw `Incorrect username`;
	}

	const user_collection_c = await user_collection();
	username = username.toLowerCase().trim();
	let user = await user_collection_c.findOne({ username: username });
	if (!user) throw `User not present`;

	return user;
};

const deregEvent = async (username, id) => {
	try{
		helpers.errorIfNotProperID(id, "id");
		helpers.errorIfNotProperUserName(username, "username");
	}catch(e){
		throw "Invalid ID";
	}
	const user_collection_c = await user_collection();
	const userData = await getUserData(username);
	// FIXME: this doesn't seem to modify the DB
	for(let i = 0; i < userData.eventsRegistered.length; i++){
		if(userData.eventsRegistered[i] == id){
			userData.eventsRegistered.push(userData.eventsRegistered[i]);
		}
	}
	return userData;
}

module.exports = { createUser, checkUser, getUserData, deregEvent };

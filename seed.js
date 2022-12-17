const data = require('./data');
const mongoConnection = require('./config/mongoConnection');
const commentData = data.comments;
const eventData = data.events;
const userData = data.users;
const { ObjectId } = require('mongodb');

async function main() {
    const db = await mongoConnection.dbConnection();
    await db.dropDatabase();
    let larry = await userData.createUser("larrystooge", "Secret_Password1", "Larry", "Fine", "Stevens Institute of Technology");
    let curly = await userData.createUser("curlystooge", "Secret_Password2", "Curly", "Howard", "Stevens Institute of Technology");
    //TODO
    let levent = await eventData.createEvent("Larry's Event", "Moe's House", '2022-12-30T12:00', '2022-12-31T12:00', "larrystooge", "fun, awesome, event", "Nyucknyucknyucknyucknyuck!", 20, )
    console.log("Finished seeding");
    await mongoConnection.closeConnection();
    return;
}

const data = require('./data');
const mongoConnection = require('./config/mongoConnection');
const commentData = data.comments;

const userData = data.users;
const eventData = data.events;
const { ObjectId } = require('mongodb');
const testImages = require("./testImages");

const catImage = testImages[0].image;
const pokemonImage1 = testImages[1].image
const pokemonImage2 = testImages[2].image


async function main() {
    const db = await mongoConnection.dbConnection();
    await db.dropDatabase();
    let larry = await userData.createUser("larrystooge", "Secret_Password1", "Larry", "Fine", "Stevens Institute of Technology");
    let curly = await userData.createUser("curlystooge", "Secret_Password2", "Curly", "Howard", "Stevens Institute of Technology");
    let moe = await userData.createUser("moestooge", "Secret_Password3", "Moe", "Howard", "Rutgers University");

    let levent = await eventData.createEvent("Larry's Event", "Moe's House", '2022-12-30T12:00', '2022-12-31T12:00', "larrystooge", "fun, awesome, event", "Nyucknyucknyucknyucknyuck!", "20", catImage)
    console.log("Finished seeding");
    await mongoConnection.closeConnection();
    return;
}

main().catch(console.log);
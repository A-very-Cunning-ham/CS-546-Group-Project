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
    //create users
    let larry = await userData.createUser("larrystooge", "Secret_Password1", "Larry", "Fine", "Stevens Institute of Technology");
    let curly = await userData.createUser("curlystooge", "Secret_Password2", "Curly", "Howard", "Stevens Institute of Technology");
    let moe = await userData.createUser("moestooge", "Secret_Password3", "Moe", "Howard", "Rutgers University");

    //create events
    let levent = await eventData.createEvent("Larry's Event", "Larry's House", '2022-12-30T12:00', '2022-12-31T12:00', "larrystooge", "fun, awesome, event", "Nyucknyucknyucknyucknyuck!", "20", catImage);
    let cevent = await eventData.createEvent("Curly's Event", "Curly's House", '2022-12-25T18:00', '2022-12-25T21:30', "curlystooge", "christmas, party, presents", "Merry Christmas to all!", "15", pokemonImage1);
    let mevent = await eventData.createEvent("Curly's Event", "Curly's House", '2022-12-31T23:00', '2022-01-01T01:45', "moestooge", "hello, hi, howdy, aloha", "Hey, where is everybody at Rutgers?", "5", pokemonImage2);
    //now test register, favorite, unregister, unfavorite, cancel, comment
    console.log("Finished seeding");
    await mongoConnection.closeConnection();
    return;
}

main().catch(console.log);
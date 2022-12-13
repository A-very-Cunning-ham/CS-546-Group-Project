const commentRoutes = require("./comments");
const eventRoutes = require("./events");
const userRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/", userRoutes);
    app.use("/login", userRoutes);//dank is working on this route
    app.use("/register", userRoutes);//dank is working on this route 
    app.use("/registered", userRoutes);
    app.use("/create", userRoutes);
    app.use("/created", userRoutes);
    app.use("/favorited", userRoutes);
    app.use("/event", eventRoutes);
    // app.use("/events/register/:id", eventRoutes);
    // app.use("/events/favorite/:id", eventRoutes);
    app.use("/comment/event/:id", commentRoutes);
    app.use("/logout", routes);//dank is working on this route

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
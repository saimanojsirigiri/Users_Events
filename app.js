const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const UserEvents = require("./Databases/UserEvents.Database");
const createError = require("http-errors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

require("dotenv").config();
require("./Helper/Init_MongoDB");
const PORT = process.env.PORT || 3030;
const { validateDbId } = require("./Functions/functions");

app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/getUserData/:id", validateDbId, async(req, res, next) => {
    const { id } = req.params;
    try {
        const user = await UserEvents.findById(id);
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "User Data not found" });
        }
    } catch (err) {
        console.log("Error: " + err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/saveUserData", async(req, res) => {
    const {
        _id,
        totalEventsPlayed,
        pointsEarned,
        pointsRedeemed,
        upcomingEvents,
        rsvpdEvents,
    } = req.body;
    try {
        const userExists = await UserEvents.findById(_id);
        if (!userExists) {
            const newUserEvent = new UserEvents({
                _id,
                totalEventsPlayed,
                pointsEarned,
                pointsRedeemed,
                upcomingEvents,
                rsvpdEvents,
            });
            const data = await UserEvents.create(newUserEvent);
            return res.status(200).json({ data });
        } else {
            return res.status(400).json({ message: "User Data Already Saved" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/updateUserData/:id", async(req, res) => {
    const {
        totalEventsPlayed,
        pointsEarned,
        pointsRedeemed,
        upcomingEvents,
        rsvpdEvents,
    } = req.body;
    try {
        const user = await UserEvents.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    totalEventsPlayed,
                    pointsEarned,
                    pointsRedeemed,
                    upcomingEvents,
                    rsvpdEvents,
                }
            }, { upsert: true, new: true }
        );
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: "No user found" });
        }
    } catch (err) {
        console.log("Error Message: " + err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// For error Handling
app.use(async(req, res, next) => {
    next(createError.NotFound(`Url doesn't exist`));
});

app.use(async(err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: "Something went wrong!",
        },
    });
    console.log(err);
});

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
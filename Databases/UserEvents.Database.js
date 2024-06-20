const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userEventsSchema = new schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    totalEventsPlayed: {
        type: String,
        default: "0",
    },
    pointsEarned: {
        type: String,
        default: "0",
    },
    pointsRedeemed: {
        type: String,
        default: "0",
    },
    upcomingEvents: {
        type: String,
        default: "0",
    },
    rsvpdEvents: {
        type: String,
        default: "0",
    }
}, { timestamps: true });

const userEvents = mongoose.model("UserEvents", userEventsSchema);
module.exports = userEvents;
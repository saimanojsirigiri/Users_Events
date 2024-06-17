const ObjectId = require("mongoose").Types.ObjectId;
require('dotenv').config();

const validateDbId = (req, res, next) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
            error: "Given user id is not valid",
        });
    }
    next();
};

module.exports = { validateDbId };
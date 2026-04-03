const mongoose = require("mongoose");
const linkSchema = new mongoose.Schema(
    {
        short: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        longUrl: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        passWord: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}  
);

module.exports = mongoose.model("Link", linkSchema);
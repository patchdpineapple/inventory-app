const mongoose = require("mongoose");

const Schema = mongoose.Schema();

let GameSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    status: { type: String, required: true, enum: ["Available", "Out of stock"] },
    developer: { type: String, },
    release: { type: String },
    platform: { type: Schema.Types.ObjectId, ref: "Platform", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String },
});

GameSchema
.virtual("url")
.get(function() {
    return "/inventory/game/" + this._id;
});

module.exports = mongoose.model("Game", GameSchema);

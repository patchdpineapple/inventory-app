const { DateTime } = require("luxon");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let GameSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    status: { type: String, required: true, enum: ["Available", "Out of stock"] },
    developer: { type: String, },
    release: { type: Date },
    platform: { type: Schema.Types.ObjectId, ref: "Platform", required: true },
    category: [{ type: Schema.Types.ObjectId, ref: "Category"}],
    image: { type: String },
});

GameSchema
.virtual("release_formatted")
.get(function() {
    return this.release ? 
    DateTime.fromJSDate(this.release).toLocaleString(DateTime.DATE_MED) 
    : "";
});

GameSchema
.virtual("release_form")
.get(function() {
    return this.release ? 
    DateTime.fromJSDate(this.release).toISODate() 
    : "";
});

GameSchema
.virtual("url")
.get(function() {
    return "/inventory/game/" + this._id;
});

module.exports = mongoose.model("Game", GameSchema);

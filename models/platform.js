const mongoose = require("mongoose");

const Schema = mongoose.Schema();

let PlatformSchema = new Schema({
    name: { type: String, required: true },
});

PlatformSchema
.virtual("url")
.get(function() {
    return "/inventory/platform/" + this._id;
});

module.exports = mongoose.model("Platform", PlatformSchema);

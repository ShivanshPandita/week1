const mongoose = require("mongoose");


const Song = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Types.ObjectId,
        ref:"user",
    },
    thumbnail:{
        type: String,
        required: true,
    },
    track:{
        type: String,
        required: true,
    },
});


const SongModel = mongoose.model("Song",Song);
module.exports =SongModel;
const mongoose = require("mongoose");


const User = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type:String,
    },
    email:{
        type: String,
    },
    username:{
        type: String,
    },
    LikedSongs:{
        type:String,
        default:"",
    },
    LikedPlaylist:{
        type: String,
        default: "",
    },
    SubscribedArtists:{
        type:String,
        default:"",
    },
});


const UserModel = mongoose.model("User",User);
module.exports =UserModel;
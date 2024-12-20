const express = require("express");
const { authenticate } = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User");
const passport = require("passport");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //req.user gets the user frompassport.authenticate
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
  }
);

router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentuser = req.user;
    const songs = await Song.find({ artist: req.user._id });
    return res.status(200).json({ data: songs });
  }
);
//get route to all songs by The artist
router.get(
  "/get/artist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistID } = req.body;
    //we cann check if the artist doesnt exist
    const artist = await User.find({ _id: artistID });
    if (!artist) {
      return res.status(301).json({ err: "Artist does not exist." });
    }

    const songs = await Song.find({ artist: artistID });
    return res.status(200).json({ data: songs });
  }
);

//get route to get a single song by name
router.get(
  "/get/songname",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.body;

    // Create a regular expression to perform case-insensitive matching
    const regex = new RegExp(songName, "i");

    // Find songs where the name matches the pattern
    const songs = await Song.find({ name: { $regex: regex } });

    return res.status(200).json({ data: songs });
  }
);

module.exports = router;

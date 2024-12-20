const express = require("express");
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

// route 1 create a playlist
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
      return res.status(301).json({ err: "Insufficient Data" });
    }
    const playlistData = {
      name,
      thmbnail,
      songs,
      owner: currentUser._id,
      collaborators: [],
    };
    const playlist = await Playlist.create(playlistData);
    return res.status(200).json(playlist);
  }
);

//route 2 get a playlist by id
router.get(
  "/get/playlist/:playlistID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const playlistID = req.params.playlistID;
    const playlist = await Playlist.findOne({ _id: playlistID });
    if (!playlist) {
      return res.status(301).json({ err: "Invalid ID" });
    }

    return res.status(200).json(playlist);
  }
);

//get all playsist by an artist

router.get(
  "/get/artist/:artistID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const artistID = req.params.artistID;

    const artist = await User.findOne({ _id: artistID });
    if (!artistID) {
      return res.status(304).json({ err: "Invalid Artist ID" });
    }

    const playlists = await Playlist.find({ owner: artistID });

    return res.status(200).json({ data: playlists });
  }
);

//add a song to a playlist
router.post(
  "/add/song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { playlistID, songID } = req.body;
    //1 check if owner or collaborator
    const playlist = await Playlist.findOne({ _id: playlistID });
    if (!playlist) {
      return res.status(304).json({ err: "Playlist does not exist" });
    }
    if (
      !playlist.owner == currentUser._id &&
      playlist.collaborators.includes(currentUser._id)
    ) {
        return res.status(400).json({err:"Not allowed"});
    }

    const song = await Song.findOne({_id:songID})
    if (!playlist) {
        return res.status(304).json({ err: "Song does not exist" });
      }

    //we can now add the song as everything is valid
    playlist.songs.push(songID);
    await playlist.save;

    return res.status(200).json({data:songs})
  }
);

module.exports = router;

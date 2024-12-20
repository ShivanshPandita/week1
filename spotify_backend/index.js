const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/User");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes =require("./routes/playlist");
const app = express();
const PORT = 8080;

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.xur7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

    { useNewUrlParser: true, useUnifiedTopology: true } // Add useful connection options
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message); // Improved error logging
  });

//passport setup

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thiskeyissupposedtobesecret";
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ id: jwt_payload.sub }); // Await Promise from findOne
      if (user) {
        return done(null, user); // User found, pass it to done
      } else {
        return done(null, false); // No user found
      }
    } catch (err) {
      return done(err, false); // Handle error case
    }
  })
);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song",songRoutes);
app.use("/playlist",playlistRoutes);

// Server will run on localhost:8000
app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});

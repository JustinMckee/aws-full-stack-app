import express from "express";
import {tweets} from "../tweets.js";

export const router = express.Router();

// GET tweet by id
router.get("/tweet/:id", (req, res) => {
    let {id} = req.params;

    if(!id) {
        return res.status(400).send("Tweet id is required");
    }

    const tweetById = tweets.find(t => t.id === parseInt(id))
    if(!tweetById){
        return res.status(404).send("Tweet not found");
    }

    return res.status(200).send(tweetById);

});

// GET all tweets
router.get("/tweets", (req,res) => {
    let {author} = req.query;
    let tweetList = tweets;

    if(author) {
        tweetList = tweets.filter((tweet) => tweet.author === author);
    }

    res.status(200).send(tweetList);
});

// POST tweet
router.post("/tweets",(req,res) => {
    let {author, text, imgUrl} = req.body;

    if(!author || !text) {
        return res.status(400).send("Missing required tweet info.");
    }

    const newTweet = {id: tweets.length, text, author, imgUrl};
    tweets.push(newTweet);

    res.status(200).send(newTweet);
})
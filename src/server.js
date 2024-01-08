import bodyParser from "body-parser";
import express from "express";
import {router as tweetRoutes} from "./routes/tweetRoutes.js";
import {router as imageRoutes} from "./routes/imageRoutes.js";

(async () => {
    // Create an Express application.
    const app = express();
    // Default port to listen.
    const port = 8080;

    // Use middleware so post bodies
    // are accessable as req.body.{{vairable}}
    app.use(bodyParser.json());
    app.use(express.urlencoded({extended: true})) // for request from forms-like data
    
    // Root URI call
    app.get("/", (req,res) => {
        res.status(200).send("Welcome to the Cloud!");
    });

    app.use(tweetRoutes,imageRoutes);

    app.listen(port, () => {
        console.log(`Server running http://localhost:${port}`);
        console.log("Press CTRL+C to stop the server.")
    });

})();
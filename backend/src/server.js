import AWSXRay from 'aws-xray-sdk';
import bodyParser from "body-parser";
import express from "express";
import {router as tweetRoutes} from "./routes/tweetRoutes.js";
import {router as imageRoutes} from "./routes/imageRoutes.js";
import {router as authRoutes} from './routes/authRoutes.js';
import { requiresAuth } from './middleware/requiresAuthMiddleware.js';
import cors from 'cors';

(async () => {
    // Create an Express application.
    const app = express();
    // Default port to listen.
    const port = 8080;

    // Use middleware so post bodies
    // are accessable as req.body.{{vairable}}
    app.use(bodyParser.json());
    app.use(express.urlencoded({extended: true})) // for request from forms-like data
    app.use(AWSXRay.express.openSegment('tweets-app'));
    app.options('*', cors()) // include before other routes
    app.use(cors());
    
    // Root URI call
    app.get("/", (req,res) => {
        res.status(200).send("Welcome to the Cloud!");
    });

    app.use("/auth", authRoutes);
    app.use("/tweets", requiresAuth(), tweetRoutes);
    app.use("/images", requiresAuth(), imageRoutes);

    app.use(AWSXRay.express.closeSegment());
    
    app.listen(port, () => {
        console.log(`Server running http://localhost:${port}`);
        console.log("Press CTRL+C to stop the server.")
    });

})();
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {app, server} from "./app.js";
dotenv.config();
const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME,
    MONGO_HOST,
    MONGO_PORT,
    PORT
} = process.env;
const uriString= `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`

const start = async () => {
    try {
        await mongoose.connect(uriString)
        console.log('MONGO Connected!')

         server.listen(PORT, () => console.log(`Listening on ${PORT}`));

    }
    catch(err) {
        await gracefullyStop()
    }
}
const gracefullyStop = async (err) => {
    console.error('gracefully stopped becouse of error: ', err);
    process.exit(1);
}
start()
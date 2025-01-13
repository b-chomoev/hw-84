import express from "express";
import User from "../models/User";
import {Error} from "mongoose";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });

        newUser.generateToken();
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    res.send('sessions');
});

export default usersRouter;
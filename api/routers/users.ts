import express from "express";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });

        await newUser.save();
        res.send(newUser);
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    res.send('sessions');
});

export default usersRouter;
import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import bcrypt from "bcrypt";

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
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            res.status(400).send({error: 'Username not found'});
            return;
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong'});
            return;
        }

        user.generateToken();
        await user.save();
        res.send({message: 'Username and password are correct', user});
        return;
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

export default usersRouter;
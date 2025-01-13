import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../models/Task";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    try {
        const newTask = new Task({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        })

        let expressReq = req as RequestWithUser;
        const user = expressReq.user;

        await newTask.save();
        res.send({message: "New task is created successfully", newTask});
    } catch (error) {
        next(error);
    }
});

tasksRouter.get('/', auth,async (req, res, next) => {
    try {
        let expressReq = req as RequestWithUser;
        const user = expressReq.user;

        const tasks = await Task.find({user: user._id}).select('-__v');
        res.send(tasks);
    } catch (error) {
        next(error);
    }
});

export default tasksRouter;
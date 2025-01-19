import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../models/Task";
import {Error} from "mongoose";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user._id;

    const {title, description, status} = req.body;

    try {
        const newTask = new Task({
            user: user,
            title: title,
            description: description,
            status: status,
        });

        await newTask.save();
        res.send({message: "New task is created successfully", newTask});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return;
        }
        next(e);
    }
});

tasksRouter.get('/', auth,async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;

    try {
        const tasks = await Task.find({user: user._id}).select('-__v');
        res.send(tasks);
    } catch (error) {
        next(error);
    }
});

tasksRouter.patch('/:id', auth, async (req, res, next) => {
    let expressReq = req as RequestWithUser;
    const user = expressReq.user._id;

    try {
        const task = await Task.findOne({_id: req.params.id, user: user});

        if (!task) {
            res.status(404).send({error: 'Task not found or access denied'});
            return;
        }

        if(req.body.user) delete req.body.user;

        const updateTask = await Task.findOneAndUpdate(
            {_id: req.params.id, user: user},
            {$set: req.body},
            {new: true, runValidators: true}
        );

        res.send(updateTask);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return;
        }
        next(e);
    }
});

// tasksRouter.put('/:id', auth, async (req, res, next) => {
//     let expressReq = req as RequestWithUser;
//     const user = expressReq.user._id;
//
//     try {
//         const task = await Task.findOne({_id: req.params.id, user: user});
//
//         if (!task) {
//             res.status(404).send({error: 'Task not found or access denied'});
//             return;
//         }
//
//         const updateTask = await Task.findOneAndReplace(
//             {_id: req.params.id, user: user},
//             {user: task.user, title: req.body.title, description: req.body.description, status: req.body.status},
//             {new: true, runValidators: true}
//         );
//
//         res.send(updateTask);
//     } catch (e) {
//         if (e instanceof Error.ValidationError) {
//             res.status(400).send(e);
//             return;
//         }
//         next(e);
//     }
// });

// tasksRouter.put('/:id', auth, async (req, res, next) => {
//     const id = req.params.id;
//     const task: TaskFields = req.body;
//     let expressReq = req as RequestWithUser;
//     const user = expressReq.user;
//
//     if (!id) {
//         res.status(400).send({error: 'ID must be present in the request'});
//         return;
//     }
//
//     if (user._id.toString() !== task.user.toString()) {
//         res.status(403).send({error: 'You can update only your tasks'});
//         return;
//     }
//
//     try {
//         const updatedTask = await Task.findOneAndReplace(id, task);
//
//         if (updatedTask) {
//             res.send({message: 'Task is updated successfully', updatedTask});
//             return;
//         }
//     } catch (error) {
//         next(error);
//     }
// });

tasksRouter.delete('/:id', auth, async (req, res, next) => {
    const id = req.params.id;
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;
    const task = await Task.findById(id);

    if (!id) {
        res.status(400).send({error: 'Id must be present in the request'});
        return;
    }

    if (!task) {
        res.status(404).send({error: 'Task not found'});
        return;
    }

    if (user._id.toString() !== task.user.toString()) {
        res.status(403).send({error: 'You can delete only your tasks. You are not authorized to delete this task'});
        return;
    }

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) res.status(404).send({error: 'Task not found'});

        res.send({message: 'Task is deleted successfully', deletedTask});
    } catch (error) {
        next(error);
    }
});

export default tasksRouter;
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['todo', 'in progress', 'done'],
        default: 'todo',
    }
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
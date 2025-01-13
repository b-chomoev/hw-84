import express from 'express';
import config from "./config";
import * as mongoose from "mongoose";
import mongoDb from "./mongoDb";
import usersRouter from "./routers/users";
import tasksRouter from "./routers/tasks";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
    await mongoose.connect(config.db)

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoDb.disconnect();
    });
};

run().catch(err => console.log(err));

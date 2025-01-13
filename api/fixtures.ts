import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import {randomUUID} from "node:crypto";
import Task from "./models/Task";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tasks');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not present');
    }

    const [userJohn, userJane] = await User.create({
        username: 'John',
        password: '123',
        token: randomUUID(),
    }, {
        username: 'Jane',
        password: '123',
        token: randomUUID(),
    });

    await Task.create({
        user: userJohn._id,
        title: 'Wash the car',
        description: 'This is task for John',
        status: 'new',
    }, {
        user: userJane._id,
        title: 'Buy milk',
        description: 'This is task for Jane',
        status: 'new',
    });

    await db.close();
}

run().catch(err => console.log(err));
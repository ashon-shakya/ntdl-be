// const express = require('express')
import express from "express";
import path from "path";
import fs from "fs-extra";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

console.log(1000, process.env.PORT);
mongoose.connect(process.env.MONGO_URL);

const taskSchema = new mongoose.Schema({
  task: String,
  hr: Number,
  type: String,
});

const Task = mongoose.model("task", taskSchema);

// allow cors
app.use(cors());

// middleware to populate req.body
app.use(express.json());

// RESTFul APIS
// tasks

// endpoint : localhost:5000/api/v1/tasks

app.get("/", (req,res)=>{ res.send("NTDL BE API")});

// CRUD
// CREATE a task
// POST
app.post("/api/v1/tasks", async (request, response) => {
  const task = request.body;

  // To write in the DATABASE
  const taskData = new Task(task);
  const newData = await taskData.save();

  const responseObject = {
    status: "success",
    message: "task Created",
    task: newData,
  };

  response.send(201, responseObject);
});

// READING tasks
app.get("/api/v1/tasks", async (request, response) => {
  const allTaskData = await Task.find();

  const responseObject = {
    status: "success",
    message: "task Listed",
    task: allTaskData,
  };

  response.send(responseObject);
});

// READING tasks
app.get("/api/v1/tasks/:id", async (request, response) => {
  const id = request.params.id;
  const { randomVariable } = request.query;

  console.log(randomVariable);

  const data = await fs.readFile("./data/tasks.json", "utf8");
  const taskData = JSON.parse(data);

  const task = taskData.find((task) => task.id == id);

  let responseObject = {};
  let serverCode = 200;
  if (task) {
    responseObject = {
      status: "success",
      message: "task Found",
      task,
    };
  } else {
    responseObject = {
      status: "error",
      message: "task not found",
    };

    serverCode = 404;
  }
  response.send(serverCode, responseObject);
});

// updating tasks
app.put("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const newData = request.body;

    //db update
    const taskData = await Task.findByIdAndUpdate(
      id,
      {
        $set: newData,
      },
      {
        new: true,
      }
    );

    const successObject = {
      status: "success",
      message: "Task Updated",
      task: taskData,
    };

    response.send(200, successObject);
  } catch (err) {
    console.log(err);
    const errorObject = {
      status: "error",
      message: "Error updating Task",
    };

    response.status(500).send(errorObject);
  }
});

app.patch("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const newData = request.body;
    //db update
    const taskData = await Task.findByIdAndUpdate(
      id,
      {
        $set: newData,
      },
      {
        new: true,
      }
    );

    const successObject = {
      status: "success",
      message: "Task Updated",
      task: taskData,
    };

    response.send(200, successObject);
  } catch (err) {
    console.log(err);
    const errorObject = {
      status: "error",
      message: "Error updating Task",
    };

    response.status(500).send(errorObject);
  }
});

// deleting task
app.delete("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
    // db delete
    await Task.findByIdAndDelete(id);

    const responseObject = {
      status: "success",
      message: "Task Deleted",
    };
    response.send(200, responseObject);
  } catch (err) {
    const responseObject = {
      status: "error",
      message: "Error deleting Task",
    };
    response.send(500, responseObject);
  }
});

// do not change
// to start the server
app.listen(PORT, () => {
  console.log("SERVER STARTED");
});

const express = require("express");
const app = express();
const mongoose = require("./db/mongoose");

const { List } = require("./db/models/list.model");
const { Task } = require("./db/models/task.model");

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/lists", (req, res) => {
  //Return all lists in array
  List.find().then((rec) => {
    res.send(rec);
  });
});

app.post("/lists", (req, res) => {
  //Create new list
  const title = req.body.title;

  const newList = new List({
    title,
  });

  newList.save().then((rec) => {
    res.send(rec);
  });
});

app.patch("/lists/:id", (req, res) => {
  //Update selected list
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

app.delete("/lists/:id", (req, res) => {
  //Delete selected list
  List.findOneAndRemove({ _id: req.params.id }).then((rec) => {
    res.send(rec);
  });
});

app.get("/lists/:listId/tasks", (req, res) => {
  //Get all tasks in a selected list
  Task.find({
    _listId: req.params.listId,
  }).then((rec) => {
    res.send(rec);
  });
});

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  //Get a single task in a selected list
  Task.findOne({
    _listId: req.params.listId,
    _id: req.params.taskId,
  }).then((rec) => {
    res.send(rec);
  });
});

app.post("/lists/:listId/tasks", (req, res) => {
  //Create new task in selected list
  const newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((rec) => {
    res.send(rec);
  });
});

app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  //Update task in a selected list
  Task.findOneAndUpdate(
    {
      _listId: params.req.listId,
      _id: req.params.taskId,
    },
    { $set: req.body }
  ).then(() => {
    res.sendStatus(200);
  });
});

app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  //Delete task in selected list
  List.findOneAndRemove({
    _listId: params.req.listId,
    _id: req.params.taskId,
  }).then((rec) => {
    res.send(rec);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 4200");
});

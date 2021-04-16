const express = require("express");
const app = express();
const mongoose = require("./db/mongoose");

const { List } = require("./db/models/list.model");
const { Task } = require("./db/models/task.model");
const { User } = require("./db/models/user.model");
// const { User } = require("./db/models/user.model");

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let verifySession = (req, res, next) => {
  let _id = req.header("_id");
  let refreshToken = req.header("x-refresh-token");

  let isSessionValid = false;

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }
      req.user_id = user._id;
      req.refreshToken = refreshToken;
      req.userObject = user;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        next();
      } else {
        return Promise.reject({
          error: "Session has expired. Please check your refresh token.",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

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
      _listId: req.params.listId,
      _id: req.params.taskId,
    },
    { $set: req.body }
  ).then(() => {
    res.send({ message: "Updated succesfully" });
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

app.post("/users", (req, res) => {
  //User sign up - create session and generate auth token to be sent back to user in header
  let body = req.body;
  let newUser = new User(body);
  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refToken) => {
      return newUser.generateAccessAuthToken().then((accessToken) => {
        return { accessToken, refToken };
      });
    })
    .then((authToken) => {
      res
        .header("x-refresh-token", authToken.refToken)
        .header("x-access-token", authToken.accessToken)
        .send(newUser);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then((user) => {
      user
        .createSession()
        .then((refToken) => {
          return user.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refToken };
          });
        })
        .then((authToken) => {
          res
            .header("x-refresh-token", authToken.refToken)
            .header("x-access-token", authToken.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get("/users/me/access-token", verifySession, (req, res) => {
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

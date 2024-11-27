const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs = require("fs");

const app = express();
app.use(express.json());

// Use CORS middleware before defining any routes
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.get("/users", (req, res) => {
  return res.json(users);
});

//Delete user details
app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredUsers = users.filter((user) => user.id !== id);
  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err, data) => {
    return res.json(filteredUsers);
  });
});

//add new user

app.post("/users", (req, res) => {
  let { name, age, city } = req.body;

  if (!name || !age || !city) {
    res.status(400).send({ message: "All Fields Required" });
  }
  let id = Date.now();
  users.push({ id, name, age, city });

  fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "User Detail added success" });
  });
});

//Update User

app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;

  if (!name || !age || !city) {
    res.status(400).send({ message: "All Fields Required" });
  }

  let index = users.findIndex((user) => user.id == id);

  users.splice(index,1,{...req.body});

  fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "User Detail Updated Success" });
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

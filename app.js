const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// Init app and middlewares
const app = express();
app.use(express.json());

// Connect to database
let db;
connectToDb((err) => {
  if (err) return;
  // Listening to responses on port 3000
  app.listen(3000, () => {
    console.log("App starts listening to requests");
  });
  db = getDb();
});

// Create new user
app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const { email, password } = newUser;
    if (!email || !password) throw new Error("Missing data");
    const result = await db.collection("users").insertOne(newUser);
    if (!result) throw new Error("Enable to add a new user");
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new project
app.post("/projects", async (req, res) => {
  try {
    const newProject = req.body;
    const { name, description } = req.body;
    if (!name || !description) throw new Error("Missing data");
    const result = await db.collection("projects").insertOne(newProject);
    if (!result) throw new Error("Enable to add a new project to the database");
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete project
app.delete("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!ObjectId.isValid(projectId)) throw new Error("Invalid object Id");
    const result = await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(projectId) });
    if (!result) throw new Error("Enable to remove this project from the db");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add progress status to project
app.patch("/projects/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!ObjectId.isValid(projectId)) throw new Error("Invalid project Id");
    const progressStatus = req.body;
    const result = await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(projectId) },
        { $push: { progress: progressStatus } }
      );
    if (!result) throw new Error("Enable to add new progress status");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add new issue to project
app.post("/projects/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!ObjectId.isValid(projectId)) throw new "Ivalid project Id"();
    const newIssue = req.body;
    const result = await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(projectId) },
        { $push: { issues: newIssue } }
      );
    if (!result) throw new "Enable to add new issue"();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove issue
app.delete("projects/:projectId/:issueId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!ObjectId.isValid(projectId)) throw new Error("Invalid project Id");
    const issueId = req.params.issueId;
    if (!ObjectId.isValid(issueId)) throw new Error("Invalid issue id");
    const result = await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(projectId) },
        { $pull: { _id: new ObjectId(issueId) } }
      );
    if (!result) throw new Error("Enable to delete issue");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

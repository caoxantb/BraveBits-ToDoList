const listsRouter = require("express").Router();

const mongoose = require("mongoose");
const List = require("../models/list");

listsRouter.get("/:id", async (req, res) => {
  const listID = req.params.id;
  const list = await List.findById(listID).populate("tasks");
  res.json(list);
});

// listsRouter.post("/", async (req, res) => {
//   const body = req.body;
//   const list = await List.create(body);
//   res.status(201).json(list);
// });

listsRouter.put("/:id", async (req, res) => {
  const listID = req.params.id;
  const body = req.body;

  const tasks = body.tasks.map((t) => mongoose.Types.ObjectId(t.id));

  console.log(tasks);

  const newList = {
    tasks: tasks,
  };

  const updatedList = await List.findByIdAndUpdate(listID, newList);
  res.json(updatedList);
});

module.exports = listsRouter;

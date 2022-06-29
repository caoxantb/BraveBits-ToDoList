const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "todolist",
  },
  name: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("List", listSchema);

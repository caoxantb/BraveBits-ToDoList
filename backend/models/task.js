const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  checked: {
    type: Boolean,
    default: false,
  },
});

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Task", taskSchema);

const express = require("express");
const todoSchema = require("../schemas/todoSchemas");
const mongoose = require("mongoose");
const router = express.Router();
const Todo = new mongoose.model("Todo", todoSchema);

router.get("/", async (req, res) => {
  await Todo.find({ status: "active" })
    .clone()
    .select({ _id: 0, __v: 0, date: 0 })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "there was a server side error",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "data has been represented",
        });
      }
    });
});

router.get("/:id", async (req, res) => {
  await Todo.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "there was a server side error",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "selected todo has been represented",
      });
    }
  }).clone();
});

router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: "there was a server side error",
      });
    } else {
      res.status(200).json({
        message: "todo was inserted successfully",
      });
    }
  });
});

router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "there was a server side error",
      });
    } else {
      res.status(200).json({
        message: "todos were inserted successfully",
      });
    }
  });
});

router.put("/:id", async (req, res) => {
  const result = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "there was a server side error",
        });
      } else {
        res.status(200).json({
          message: "todo was updated successfully",
        });
      }
    }
  ).clone();
  console.log(result);
});

router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: "there was a server side error",
      });
    } else {
      Todo.find({}, (err, data) => {
        if (err) {
          res.status(500).json({
            error: "there was a server side error",
          });
        } else {
          res.status(200).json({
            result: data,
            message:
              "selected todo has deleted and the remain todos are represented",
          });
          console.log(data);
        }
      });
      // res.status(200).json({
      //   result :
      //   message: "todo was deleted successfully",
      // });
    }
  }).clone();
});

module.exports = router;

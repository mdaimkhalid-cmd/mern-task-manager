const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
    try {
        if (!req.body.title || req.body.title.trim() === "") {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = new Task({
            title: req.body.title.trim()
        });

        const savedTask = await task.save();

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
});

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks",
            error: error.message
        });
    }
});

// Get one task by ID
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get task",
            error: error.message
        });
    }
});

// Update a task
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                completed: req.body.completed
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
});

// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
});
module.exports = router;
const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const { body, param } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Create a new task
router.post(
    "/",
    authMiddleware,
    [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Task title is required")
            .isLength({ max: 200 })
            .withMessage("Task title cannot exceed 200 characters")
    ],
    validate,
    async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title.trim(),
            user: req.userId
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

// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks",
            error: error.message
        });
    }
});

// Get one task by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);
    }   catch (error) {
            next(error);
        }
});

// Update a task
router.put(
    "/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid task ID"),

        body("title")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Task title cannot be empty")
            .isLength({ max: 200 })
            .withMessage("Task title cannot exceed 200 characters"),

        body("completed")
            .optional()
            .isBoolean()
            .withMessage("Completed must be true or false")
            .toBoolean()
    ],
    validate,
    async (req, res) => {
        try {
            const updatedTask = await Task.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.userId
                },
                {
                    ...(req.body.title !== undefined && {
                        title: req.body.title
                    }),
                    ...(req.body.completed !== undefined && {
                        completed: req.body.completed
                    })
                },
                {
                    new: true,
                    runValidators: true
                }
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
    }
);

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

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
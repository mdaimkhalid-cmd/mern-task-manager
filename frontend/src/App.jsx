import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./Auth";

function App() { const [token, setToken] = useState(
                            localStorage.getItem("token")
                        );

                        const [user, setUser] = useState(
                            JSON.parse(localStorage.getItem("user")) || null
                        );

                        const [isGuest, setIsGuest] = useState(
                            localStorage.getItem("isGuest") === "true"
                        );
                 const [taskTitle, setTaskTitle] = useState("");
                 const [taskPriority, setTaskPriority] = useState("medium");
                 const [taskDueDate, setTaskDueDate] = useState("");
                 const [taskDescription, setTaskDescription] = useState("");
                 const [showDetails, setShowDetails] = useState(false);
                 const [tasks, setTasks] = useState([]);
                 const [editingTaskId, setEditingTaskId] = useState(null);
                 const [detailsOpen, setDetailsOpen] = useState(null);
                 const [error, setError] = useState("");
                 const [filter, setFilter] = useState("all");
                 const [sortBy, setSortBy] = useState("newest");
                 const [searchTerm, setSearchTerm] = useState("");
                 const [loading, setLoading] = useState(true);

                 const API_URL = import.meta.env.VITE_API_URL;
                 const handleLogin = (newToken, newUser, guest = false) => {
                        localStorage.setItem("user", JSON.stringify(newUser));

                        if (guest) {
                            localStorage.removeItem("token");
                            localStorage.setItem("isGuest", "true");
                        } else {
                            localStorage.setItem("token", newToken);
                            localStorage.removeItem("isGuest");
                        }

                        setTasks([]);
                        setError("");

                        setToken(newToken);
                        setUser(newUser);
                        setIsGuest(guest);
                    };

                    const handleLogout = () => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("isGuest");

                        setTasks([]);
                        setError("");

                        setToken(null);
                        setUser(null);
                        setIsGuest(false);
                    };
                 useEffect(() => {
                    const fetchTasks = async () => {

                        // Guest mode
                        if (isGuest) {
                            const guestTasks = JSON.parse(
                                localStorage.getItem("guestTasks")
                            ) || [];

                            setTasks(guestTasks);
                            setLoading(false);
                            return;
                        }

                        // Registered user
                        try {
                            const response = await axios.get(API_URL, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            setTasks(response.data);
                        } catch (error) {
                            console.error("Failed to fetch tasks:", error);
                            setError(
                                "Failed to load tasks. Please make sure the server is running."
                            );
                        } finally {
                            setLoading(false);
                        }
                    };

                    fetchTasks();
                }, [token, isGuest]);

                const filteredTasks = tasks.filter((task) => {
                    const matchesFilter =
                        filter === "all" ||
                        (filter === "completed" && task.completed) ||
                        (filter === "pending" && !task.completed);

                    const matchesSearch = task.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                    return matchesFilter && matchesSearch;
                });

                const sortedTasks = [...filteredTasks].sort((a, b) => {
                    if (sortBy === "newest") {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }

                    if (sortBy === "oldest") {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    }

                    if (sortBy === "priority") {
                        const priorityOrder = {
                            high: 1,
                            medium: 2,
                            low: 3
                        };

                        return (
                            (priorityOrder[a.priority || "medium"] || 2) -
                            (priorityOrder[b.priority || "medium"] || 2)
                        );
                    }

                    if (sortBy === "dueDate") {
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;

                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }

                    return 0;
                });

                  const handleAddTask = async () => {
                    if (taskTitle.trim() === "") {
                        setError("Please enter a task.");
                        return;
                    }

                    setError("");

                    // Guest mode
                    if (isGuest) {
                        const newTask = {
                            _id: Date.now().toString(),
                            title: taskTitle.trim(),
                            description: taskDescription.trim(),
                            priority: taskPriority,
                            dueDate: taskDueDate || null,
                            completed: false,
                            createdAt: new Date().toISOString()
                        };

                        const updatedTasks = [...tasks, newTask];

                        localStorage.setItem(
                            "guestTasks",
                            JSON.stringify(updatedTasks)
                        );

                        setTasks(updatedTasks);
                        setTaskTitle("");
                        setTaskPriority("medium");
                        setTaskDueDate("");
                        setEditingTaskId(null);
                        setTaskDescription("");
                        setShowDetails(false);

                        return;
                    }

                    // Registered user mode
                    try {
                        const response = await axios.post(
                            API_URL,
                            {
                                title: taskTitle,
                                description: taskDescription.trim(),
                                priority: taskPriority,
                                dueDate: taskDueDate || null
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        setTasks([...tasks, response.data]);
                        setTaskTitle("");
                        setTaskPriority("medium");
                        setTaskDueDate("");
                        setTaskDescription("");
                        setShowDetails(false);
                    } catch (error) {
                        console.error("Failed to add task:", error);
                        setError(
                            "Failed to add task. Please make sure the server is running."
                        );
                    }
                };
                  const handleDeleteTask = async (taskId) => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this task?"
                        );

                        if (!confirmed) {
                            return;
                        }

                        // Guest mode
                        if (isGuest) {
                            const updatedTasks = tasks.filter(
                                (task) => task._id !== taskId
                            );

                            localStorage.setItem(
                                "guestTasks",
                                JSON.stringify(updatedTasks)
                            );

                            setTasks(updatedTasks);

                            return;
                        }

                        // Registered user mode
                        try {
                            await axios.delete(`${API_URL}/${taskId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            setTasks(
                                tasks.filter((task) => task._id !== taskId)
                            );
                        } catch (error) {
                            console.error("Failed to delete task:", error);
                            setError("Failed to delete task. Please try again.");
                        }
                    };
                    const handleDeleteCompletedTasks = async () => {
                        const completedTasks = tasks.filter((task) => task.completed);

                        if (completedTasks.length === 0) {
                            return;
                        }

                        if (!window.confirm("Are you sure you want to delete all completed tasks?")) {
                            return;
                        }

                        try {
                            if (isGuest) {
                                const remainingTasks = tasks.filter((task) => !task.completed);
                                setTasks(remainingTasks);
                                return;
                            }

                            await axios.delete(`${API_URL}/completed/all`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            setTasks(tasks.filter((task) => !task.completed));
                        } catch (error) {
                            console.error("Error deleting completed tasks:", error);
                            setError("Failed to delete completed tasks.");
                        }
                    };
                  const handleToggleComplete = async (task) => {
                        // Guest mode
                        if (isGuest) {
                            const updatedTasks = tasks.map((currentTask) =>
                                currentTask._id === task._id
                                    ? {
                                        ...currentTask,
                                        completed: !currentTask.completed
                                    }
                                    : currentTask
                            );

                            localStorage.setItem(
                                "guestTasks",
                                JSON.stringify(updatedTasks)
                            );

                            setTasks(updatedTasks);

                            return;
                        }

                        // Registered user mode
                        try {
                            const response = await axios.put(
                                `${API_URL}/${task._id}`,
                                {
                                    title: task.title,
                                    completed: !task.completed
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            setTasks(
                                tasks.map((currentTask) =>
                                    currentTask._id === task._id
                                        ? response.data
                                        : currentTask
                                )
                            );
                        } catch (error) {
                            console.error("Failed to update task:", error);
                            setError("Failed to update task. Please try again.");
                        }
                    };
                  const handleEditTask = (task) => {
                        setTaskTitle(task.title);
                        setTaskDescription(task.description || "");
                        setTaskPriority(task.priority || "medium");
                        setTaskDueDate(
                            task.dueDate
                                ? new Date(task.dueDate).toISOString().split("T")[0]
                                : ""
                        );
                        setEditingTaskId(task._id);

                        if (task.description) {
                            setShowDetails(true);
                        } else {
                            setShowDetails(false);
                        }
                    };
                    const handleUpdateTask = async () => {
                        if (taskTitle.trim() === "") {
                            setError("Please enter a task.");
                            return;
                        }

                        setError("");

                        const taskId = editingTaskId;

                        // Guest mode
                        if (isGuest) {
                            const updatedTasks = tasks.map((task) =>
                                task._id === taskId
                                    ? {
                                        ...task,
                                        title: taskTitle.trim(),
                                        description: taskDescription.trim(),
                                        priority: taskPriority,
                                        dueDate: taskDueDate || null
                                      }
                                    : task
                            );

                            localStorage.setItem(
                                "guestTasks",
                                JSON.stringify(updatedTasks)
                            );

                            setTasks(updatedTasks);
                            setTaskTitle("");
                            setTaskDueDate("");
                            setEditingTaskId(null);
                            setTaskDescription("");
                            setShowDetails(false);

                            return;
                        }

                        // Registered user mode
                        try {
                            const response = await axios.put(
                                `${API_URL}/${taskId}`,
                                {
                                    title: taskTitle,
                                    description: taskDescription.trim(),
                                    priority: taskPriority,
                                    dueDate: taskDueDate || null
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            const updatedTasks = tasks.map((task) =>
                                task._id === taskId
                                    ? response.data
                                    : task
                            );

                            setTasks(updatedTasks);
                            setTaskTitle("");
                            setTaskPriority("medium");
                            setTaskDueDate("");
                            setEditingTaskId(null);
                            setTaskDescription("");
                            setShowDetails(false);

                        } catch (error) {
                            console.error("Failed to update task:", error);
                            setError("Failed to update task. Please try again.");
                        }
                    };
                    if (!token && !isGuest) {
                        return <Auth onLogin={handleLogin} />;
                    }
    return (
    <div className="app">

            <div className="user-header">
                <div className="header-left">
                    <h1>Task Manager</h1>

                    {user && (
                        <p className="welcome-message">
                            Welcome, {user.name}
                        </p>
                    )}
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
          <div className="search-box">
            <button
                className="search-icon-button"
                onClick={() => {
                    const searchInput = document.querySelector(".search-box input");
                    if (searchInput) {
                        searchInput.focus();
                    }
                }}
                aria-label="Search"
            >
                🔍
            </button>

            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
                <button
                    className="clear-search-button"
                    onClick={() => setSearchTerm("")}
                >
                    ×
                </button>
            )}
        </div>
          <div className="filters">
            <button
                className={filter === "all" ? "active-filter" : ""}
                onClick={() => setFilter("all")}
            >
                All
            </button>

            <button
                className={filter === "pending" ? "active-filter" : ""}
                onClick={() => setFilter("pending")}
            >
                Pending
            </button>

            <button
                className={filter === "completed" ? "active-filter" : ""}
                onClick={() => setFilter("completed")}
            >
                Completed
            </button>
        </div>
            <div className="sorting">
                <label htmlFor="sortBy">Sort by:</label>

                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                </select>
            </div>

            <div className="task-input">
                <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="date"
                    value={taskDueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (editingTaskId === null) {
                                handleAddTask();
                            } else {
                                handleUpdateTask();
                            }
                        }
                    }}
                />
                <button
                    type="button"
                    className="details-toggle"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "▲ Hide Details" : "▼ Add Details"}
                </button>

                {showDetails && (
                    <textarea
                        className="task-description-input"
                        placeholder="Add task details (optional)..."
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        maxLength={2000}
                    />
                )}
                <button 
                  onClick={editingTaskId === null ? handleAddTask : handleUpdateTask}
              >
                  {editingTaskId === null ? "Add Task" : "Update Task"}
              </button>
              {editingTaskId !== null && (
              <button
                  className="cancel-button"
                  onClick={() => {
                      setTaskTitle("");
                      setEditingTaskId(null);
                      setError("");
                  }}
              >
                  Cancel
              </button>
            )}
            </div>
            <div className="task-stats">
                <span>
                    Total: {tasks.length}
                </span>

                <span>
                    Completed: {tasks.filter((task) => task.completed).length}
                </span>

                <span>
                    Pending: {tasks.filter((task) => !task.completed).length}
                </span>

                <span>
                    High: {tasks.filter(
                        (task) => (task.priority || "medium") === "high"
                    ).length}
                </span>

                <span>
                    Medium: {tasks.filter(
                        (task) => (task.priority || "medium") === "medium"
                    ).length}
                </span>

                <span>
                    Low: {tasks.filter(
                        (task) => (task.priority || "medium") === "low"
                    ).length}
                </span>
            </div>
            <div className="clear-completed-wrapper">
                <button
                    className="clear-completed-button"
                    onClick={handleDeleteCompletedTasks}
                    disabled={!tasks.some((task) => task.completed)}
                >
                    Clear Completed
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            <h2 className="task-list-title">
                {filter === "all" && "All Tasks"}
                {filter === "pending" && "Pending Tasks"}
                {filter === "completed" && "Completed Tasks"}
                <span> ({filteredTasks.length})</span>
            </h2>

            {loading ? (
                <p className="loading">Loading tasks...</p>
            ) : filteredTasks.length === 0 ? (
                <p className="empty-message">
                    {filter === "all" && "No tasks found. Add a task to get started!"}
                    {filter === "pending" && "No pending tasks."}
                    {filter === "completed" && "No completed tasks."}
                </p>
            ) : (
                <div className="task-list">
    {filteredTasks.length === 0 ? (
        <p className="empty-message">
            {filter === "all" && "No tasks yet. Add your first task!"}
            {filter === "pending" && "No pending tasks."}
            {filter === "completed" && "No completed tasks."}
        </p>
    ) : (
        sortedTasks.map((task) => (
            <div className="task" key={task._id}>
                <div className="task-main">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                    />

                    <div className="task-content">
                        <div className="task-title-row">
                            <span className={task.completed ? "completed" : ""}>
                                {task.title}
                            </span>

                            <span
                                className={`priority priority-${task.priority || "medium"}`}
                            >
                                {(task.priority || "medium").toUpperCase()}
                            </span>
                        </div>

                        <div className="task-meta-row">
                            {task.dueDate && (
                                <div
                                    className={
                                        !task.completed &&
                                        new Date(task.dueDate) < new Date()
                                            ? "task-due-date overdue"
                                            : "task-due-date"
                                    }
                                >
                                    Due: {task.dueDate.split("T")[0]}

                                    {!task.completed &&
                                        new Date(task.dueDate) < new Date() && (
                                            <span className="overdue-label">
                                                OVERDUE
                                            </span>
                                        )}

                                    {!task.completed &&
                                        new Date(task.dueDate) >= new Date() &&
                                        new Date(task.dueDate) <=
                                            new Date(
                                                Date.now() + 2 * 24 * 60 * 60 * 1000
                                            ) && (
                                                <span className="due-soon-label">
                                                    DUE SOON
                                                </span>
                                            )}
                                </div>
                            )}

                            {task.description && (
                                <button
                                    type="button"
                                    className="task-details-toggle"
                                    onClick={() =>
                                        setDetailsOpen(
                                            detailsOpen === task._id ? null : task._id
                                        )
                                    }
                                >
                                    {detailsOpen === task._id
                                        ? "▲ Hide Details"
                                        : "▼ Details"}
                                </button>
                            )}
                        </div>

                        {task.description && detailsOpen === task._id && (
                            <div className="task-description">
                                {task.description}
                            </div>
                        )}
                    </div>
                </div>

                <div className="task-actions">
                    <button
                        className="edit-button"
                        onClick={() => handleEditTask(task)}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-button"
                        onClick={() => handleDeleteTask(task._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))
    )}
</div>
            )}
        </div>
    );
}

export default App;
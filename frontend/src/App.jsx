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
                 const [tasks, setTasks] = useState([]);
                 const [editingTaskId, setEditingTaskId] = useState(null);
                 const [error, setError] = useState("");
                 const [filter, setFilter] = useState("all");
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
                    if (filter === "completed") {
                        return task.completed;
                    }

                    if (filter === "pending") {
                        return !task.completed;
                    }

                    return true;
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

                        return;
                    }

                    // Registered user mode
                    try {
                        const response = await axios.post(
                            API_URL,
                            {
                                title: taskTitle
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        setTasks([...tasks, response.data]);
                        setTaskTitle("");
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
                      setEditingTaskId(task._id);
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
                                        title: taskTitle.trim()
                                    }
                                    : task
                            );

                            localStorage.setItem(
                                "guestTasks",
                                JSON.stringify(updatedTasks)
                            );

                            setTasks(updatedTasks);
                            setTaskTitle("");
                            setEditingTaskId(null);

                            return;
                        }

                        // Registered user mode
                        try {
                            const response = await axios.put(
                                `${API_URL}/${taskId}`,
                                {
                                    title: taskTitle
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
                            setEditingTaskId(null);

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
            <div>
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

            <div className="task-stats">
              <span>Total: {tasks.length}</span>
              <span>
                  Completed: {tasks.filter((task) => task.completed).length}
              </span>
              <span>
                  Pending: {tasks.filter((task) => !task.completed).length}
              </span>
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

            <div className="task-input">
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
        filteredTasks.map((task) => (
            <div className="task" key={task._id}>
                <div>
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                    />

                    <span className={task.completed ? "completed" : ""}>
                        {task.title}
                    </span>
                </div>

                <div>
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
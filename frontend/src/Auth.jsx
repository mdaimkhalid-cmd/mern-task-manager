import { useState } from "react";
import axios from "axios";

function Auth({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const AUTH_URL = API_URL.replace("/tasks", "/auth");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (isRegistering && name.trim() === "") {
            setError("Please enter your name.");
            return;
        }

        if (email.trim() === "" || password.trim() === "") {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const endpoint = isRegistering
                ? `${AUTH_URL}/register`
                : `${AUTH_URL}/login`;

            const data = isRegistering
                ? {
                    name: name.trim(),
                    email: email.trim(),
                    password
                }
                : {
                    email: email.trim(),
                    password
                };

            const response = await axios.post(endpoint, data);

            if (response.data.token) {
                onLogin(response.data.token, response.data.user);
            }

        } catch (error) {
            console.error("Authentication failed:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Task Manager</h1>

                <p className="auth-subtitle">
                    {isRegistering
                        ? "Create your account"
                        : "Welcome back"}
                </p>

                <form onSubmit={handleSubmit}>

                    {isRegistering && (
                        <div className="auth-field">
                            <label>Name</label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegistering
                                ? "Create Account"
                                : "Login"}
                    </button>

                </form>

                <div className="auth-switch">
                    {isRegistering
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError("");
                        }}
                    >
                        {isRegistering ? "Login" : "Register"}
                    </button>
                </div>
                <div className="guest-option">
                    <span>or</span>

                    <button
                        type="button"
                        onClick={() =>
                            onLogin(
                                null,
                                {
                                    name: "Guest",
                                    email: ""
                                },
                                true
                            )
                        }
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
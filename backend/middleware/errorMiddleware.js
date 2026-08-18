const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid resource ID"
        });
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message
    });
};

module.exports = errorMiddleware;
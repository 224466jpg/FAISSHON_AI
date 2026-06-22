const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const distPath = path.join(__dirname, "styleai", "dist");

app.use(cors());
app.use(express.json());

app.get("/api/recommendations", (req, res) => {
    res.json([
        {
            id: 1,
            title: "Casual Denim Jacket",
            category: "Jacket",
            style: "Casual",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
        },
        {
            id: 2,
            title: "Elegant Summer Dress",
            category: "Dress",
            style: "Elegant",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b"
        }
    ]);
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Fashion AI Backend is running"
    });
});

// Only serve static files if the dist folder exists
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    console.warn("⚠️  Frontend dist not found. Only API routes are available.");
    app.use((req, res) => {
        res.status(404).json({ error: "Frontend not built. API is running fine." });
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

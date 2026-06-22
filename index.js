const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Fashion AI Backend is running");
});

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
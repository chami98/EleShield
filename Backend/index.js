require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000;

// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/" });

app.post("/detect-elephant", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // Read the uploaded file and convert it to Base64
        const image = fs.readFileSync(req.file.path, { encoding: "base64" });

        // Send the image to the Roboflow API
        const response = await axios({
            method: "POST",
            url: process.env.URL,  // Your Roboflow API URL from the .env file
            params: {
                api_key: process.env.API_KEY  // API key from the .env file
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // Log the API response
        const apiResponseLog = `Roboflow API Response at ${new Date().toISOString()}: ${JSON.stringify(response.data)}\n\n`;
        fs.appendFileSync('image_upload_logs.txt', apiResponseLog);  // Append response to the log file

        // Clean up the uploaded file after processing
        fs.unlinkSync(req.file.path);

        // Return the detection result back to the client
        res.json({
            detected: response.data.predictions.length > 0,
            predictions: response.data.predictions
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

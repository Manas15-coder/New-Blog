const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer'); // Add multer for handling file uploads
const sharp = require('sharp'); // Add sharp for image processing

//env config
dotenv.config();

//mongodb connection
connectDB();

const app = express();

//router import
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');


//middlewares
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage: storage });

// Define an endpoint for uploading and processing images
app.post('/api/blog/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Process the uploaded image using Sharp (resize, format conversion, etc.)
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 700, height: 400 }) // Adjust dimensions as needed
            .toFormat('jpeg')
            .toBuffer();

        // You can save the processed image to a file or store it in a database here
        // For this example, we will send the processed image back as a response
        res.json({ success: true, imageUrl: `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during image processing.' });
    }
});

//routes
app.get('/', (req, res) => {
    res.send('Welcome to Backend API');
});
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);


//port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on Port no.  ${PORT}`);
});

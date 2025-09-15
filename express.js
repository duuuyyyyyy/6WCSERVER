import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// File Path Configuration for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express and Cors App Initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


// --- Temporary In-Memory Storage ---
// This will store data only as long as the server is running.
const studentDatabase = [];
const uploadedFilesLog = [];


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'upload/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'file', maxCount: 1 },
    { name: 'username', maxCount: 1 }
]);

// --- Page Routes ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/home.html'));
});

app.get('/studentForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/studentForm.html'));
});

app.get('/adminForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/adminForm.html'));
});

// --- API Routes ---

// Student Form (GET)
app.get('/getstudentForm', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        studentId: req.query.studentId,
        section: req.query.section
    };
    
    // Store the student data in the in-memory array
    studentDatabase.push(response);
    
    console.log("Received Student Data: ", response);
    console.log("Current Student Database: ", studentDatabase);

    // Send a JSON response for the front-end
    res.json(response);
});

// Admin Form (GET)
app.get('/getadminForm', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        adminId: req.query.adminId,
        department: req.query.department
    };
    console.log("Received Admin Data: ", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Admin Form Submission (POST)
app.post('/postAdmin', upload, (req, res) => {
    const username = req.body.username;
    const uploadedFile = req.files['file'][0];

    const response = {
        username: username,
        filePath: uploadedFile.path
    };

    // Store the file upload log in the in-memory array
    uploadedFilesLog.push(response);
    
    console.log("Received File Upload: ", response);
    console.log("Current Uploaded Files Log: ", uploadedFilesLog);
    
    // Send a JSON response for the front-end
    res.json({ message: 'File and form data uploaded successfully', data: response });
});

// Start the server
const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
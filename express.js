import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// File Path Configuration for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express App Initialization
const app = express();
const urlEncodeParser = bodyParser.urlencoded({ extended: false });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Multer Storage Configuration
// Tells Multer where to store the file and how to name it
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

// Multer Middleware for file and text data
// The 'fields' middleware expects an array of field names from the form
const upload = multer({ storage: storage }).fields([
    { name: 'file', maxCount: 1 },
    { name: 'username', maxCount: 1 } // Adding the text field name
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
    console.log("Response is: ", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Admin Form (GET)
app.get('/getadminForm', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        adminId: req.query.adminId,
        department: req.query.department
    };
    console.log("Response is: ", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Admin Form Submission (POST)
app.post('/postAdmin', upload, (req, res) => {
    if (!req.files || !req.files['file'] || req.files['file'].length === 0) {
            return res.status(400).send('No file was uploaded.');
        }

        // Access the text field
        const username = req.body.username;

        // Access the uploaded file
        const uploadedFile = req.files['file'][0];

        var response = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            adminId: req.body.adminId,
            department: req.body.department,
            username: req.body.username,
            filePath: uploadedFile.path
        };

        console.log("Response is: ", response);
        res.end('File and form data uploaded sudccessfully');
    });

// Start the server
const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
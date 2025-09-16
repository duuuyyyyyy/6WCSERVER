import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // A library for generating unique IDs

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
const adminDatabase = []; // New array for admin data
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

// Student Form Submission (POST)
app.post('/postStudent', upload, (req, res) => {
    const studentData = {
        id: uuidv4(), // Generate a unique ID for the new entry
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentId: req.body.studentId,
        section: req.body.section,
        username: req.body.username,
        filePath: req.files && req.files['file'] ? req.files['file'][0].path : null
    };

    studentDatabase.push(studentData);

    console.log("Received Student Data: ", studentData);
    console.log("Current Student Database: ", studentDatabase);

    // Send a JSON response for the front-end
    res.json({ message: 'Student data and file uploaded successfully', data: studentData });
});

// GET all student data
app.get('/getstudentData', (req, res) => {
    res.json({ message: 'Student data fetched successfully', data: studentDatabase });
});

// DELETE student data by ID
app.delete('/deleteStudent/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = studentDatabase.length;
    const newDatabase = studentDatabase.filter(student => student.id !== id);
    studentDatabase.splice(0, studentDatabase.length, ...newDatabase);

    if (studentDatabase.length < initialLength) {
        console.log(`Student with ID ${id} deleted.`);
        res.json({ message: `Student with ID ${id} deleted successfully.` });
    } else {
        res.status(404).json({ message: `Student with ID ${id} not found.` });
    }
});

// UPDATE student data by ID
app.put('/updateStudent/:id', upload, (req, res) => {
    const { id } = req.params;
    const studentIndex = studentDatabase.findIndex(student => student.id === id);

    if (studentIndex !== -1) {
        studentDatabase[studentIndex] = {
            ...studentDatabase[studentIndex],
            ...req.body,
            filePath: req.files && req.files['file'] ? req.files['file'][0].path : studentDatabase[studentIndex].filePath
        };
        console.log(`Student with ID ${id} updated.`);
        res.json({ message: `Student with ID ${id} updated successfully`, data: studentDatabase[studentIndex] });
    } else {
        res.status(404).json({ message: `Student with ID ${id} not found.` });
    }
});

// Admin Form Submission (POST)
app.post('/postAdmin', upload, (req, res) => {
    const adminData = {
        id: uuidv4(), // Generate a unique ID for the new entry
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        adminId: req.body.adminId,
        department: req.body.department,
        username: req.body.username,
        filePath: req.files && req.files['file'] ? req.files['file'][0].path : null
    };

    adminDatabase.push(adminData);
    uploadedFilesLog.push({
        username: adminData.username,
        filePath: adminData.filePath
    });

    console.log("Received Admin Data: ", adminData);
    console.log("Current Admin Database: ", adminDatabase);

    res.json({ message: 'Admin data and file uploaded successfully', data: adminData });
});

// GET all admin data
app.get('/getadminData', (req, res) => {
    res.json({ message: 'Admin data fetched successfully', data: adminDatabase });
});

// DELETE admin data by ID
app.delete('/deleteAdmin/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = adminDatabase.length;
    const newDatabase = adminDatabase.filter(admin => admin.id !== id);
    adminDatabase.splice(0, adminDatabase.length, ...newDatabase); // Efficiently replace the array content

    if (adminDatabase.length < initialLength) {
        console.log(`Admin with ID ${id} deleted.`);
        res.json({ message: `Admin with ID ${id} deleted successfully.` });
    } else {
        res.status(404).json({ message: `Admin with ID ${id} not found.` });
    }
});

// UPDATE admin data by ID
app.put('/updateAdmin/:id', upload, (req, res) => {
    const { id } = req.params;
    const adminIndex = adminDatabase.findIndex(admin => admin.id === id);

    if (adminIndex !== -1) {
        // Update the existing data with new values from the request body
        adminDatabase[adminIndex] = {
            ...adminDatabase[adminIndex], // Keep existing data
            ...req.body, // Overwrite with new data
            filePath: req.files && req.files['file'] ? req.files['file'][0].path : adminDatabase[adminIndex].filePath // Update file path if a new file is uploaded
        };
        console.log(`Admin with ID ${id} updated.`);
        res.json({ message: `Admin with ID ${id} updated successfully`, data: adminDatabase[adminIndex] });
    } else {
        res.status(404).json({ message: `Admin with ID ${id} not found.` });
    }
});

// Start the server
const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
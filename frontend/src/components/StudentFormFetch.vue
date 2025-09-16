<template>
    <div>
        <div class="form-container">
            <h2>STUDENT</h2>
            <form @submit.prevent="submitStudentForm">
                <div class="form-group">
                    <div>
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" v-model="studentFormData.firstName" name="firstName">
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" v-model="studentFormData.lastName" name="lastName">
                    </div>
                </div>
                <label for="studentId">Student ID:</label>
                <input type="text" id="studentId" v-model="studentFormData.studentId" name="studentId">
                <label for="section">Section:</label>
                <input type="text" id="section" v-model="studentFormData.section" name="section">
                <label for="file">Select File:</label>
                <input type="file" id="file" @change="handleFileUpload" name="file">
                <button type="submit">{{ editingStudentId ? 'UPDATE & UPLOAD' : 'SUBMIT & UPLOAD' }}</button>
                <button v-if="editingStudentId" @click="resetForm" type="button" class="cancel-button">CANCEL</button>
            </form>
        </div>

        <div class="form-container">
            <h2>STUDENT DATA</h2>
            <div v-if="studentDataList.length" class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Student ID</th>
                            <th>Section</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in studentDataList" :key="student.id">
                            <td>{{ student.firstName }}</td>
                            <td>{{ student.lastName }}</td>
                            <td>{{ student.studentId }}</td>
                            <td>{{ student.section }}</td>
                            <td class="action-buttons">
                                <button @click="editStudent(student)" class="action-button update-button">Update</button>
                                <button @click="deleteStudent(student.id)" class="action-button delete-button">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else>No student data to display.</p>
        </div>

        <div v-if="studentError" class="form-container">
            <h2>Error</h2>
            <p>Something went wrong: {{ studentError }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default {
    name: "StudentFormFetcher",
    data() {
        return {
            studentFormData: {
                firstName: '',
                lastName: '',
                studentId: '',
                section: ''
            },
            file: null,
            studentDataList: [],
            studentError: null,
            editingStudentId: null, // New data property to track the ID for updating
        };
    },
    created() {
        this.getAllStudentData();
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        submitStudentForm() {
            const formData = new FormData();
            for (const key in this.studentFormData) {
                formData.append(key, this.studentFormData[key]);
            }
            if (this.file) {
                formData.append('file', this.file);
            }

            if (this.editingStudentId) {
                // Perform an UPDATE (PUT) request
                axios.put(`http://localhost:5000/updateStudent/${this.editingStudentId}`, formData)
                    .then(res => {
                        console.log("Student data updated successfully:", res.data);
                        this.studentError = null;
                        this.resetForm();
                        this.getAllStudentData();
                    })
                    .catch(err => {
                        console.error("Error updating student data:", err.response ? err.response.data : err.message);
                        this.studentError = "Failed to update student data.";
                    });
            } else {
                // Perform a CREATE (POST) request
                axios.post('http://localhost:5000/postStudent', formData)
                    .then(res => {
                        console.log("Student data submitted successfully:", res.data);
                        this.studentError = null;
                        this.resetForm();
                        this.getAllStudentData();
                    })
                    .catch(err => {
                        console.error("Error submitting student data:", err.response ? err.response.data : err.message);
                        this.studentError = "Failed to submit student data.";
                    });
            }
        },
        getAllStudentData() {
            axios.get('http://localhost:5000/getstudentData')
                .then(res => {
                    this.studentDataList = res.data.data;
                    this.studentError = null;
                })
                .catch(err => {
                    console.error("Error fetching student data:", err.response ? err.response.data : err.message);
                    this.studentError = "Failed to fetch student data.";
                });
        },
        deleteStudent(id) {
            if (confirm("Are you sure you want to delete this student record?")) {
                axios.delete(`http://localhost:5000/deleteStudent/${id}`)
                    .then(res => {
                        console.log("Student deleted successfully:", res.data);
                        this.studentError = null;
                        this.getAllStudentData(); // Refresh the list
                    })
                    .catch(err => {
                        console.error("Error deleting student:", err.response ? err.response.data : err.message);
                        this.studentError = "Failed to delete student record.";
                    });
            }
        },
        editStudent(student) {
            // Populate the form with the selected student's data
            this.studentFormData = { ...student };
            this.editingStudentId = student.id;
        },
        resetForm() {
            // Reset form data and editing state
            this.studentFormData = {
                firstName: '',
                lastName: '',
                studentId: '',
                section: '',
            };
            this.file = null;
            this.editingStudentId = null;
        }
    }
};
</script>

<style scoped>
/* Scoped styles to match the student form's appearance and layout */

.form-container {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 20px;
    max-width: 500px;
    width: 100%;
    box-sizing: border-box;
}

h2 {
    color: #aa3d3d;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 2.5rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: bold;
    text-align: left;
}

input,
select {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1em;
}

/* Combined styles for all buttons to ensure consistency */
button,
input[type="submit"] {
    background-color: #aa3d3d;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 25px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    width: auto;
    margin-top: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

button:hover,
input[type="submit"]:hover {
    background-color: #8a2b2b;
    transform: scale(1.02);
}

input:focus,
select:focus {
    outline: none;
    border-color: #aa3d3d;
    box-shadow: 0 0 5px rgba(170, 61, 61, 0.5);
}

.form-group {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.form-group>div {
    flex: 1;
    min-width: calc(50% - 10px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.form-group label {
    text-align: left;
    margin-bottom: 8px;
}

.form-group input {
    width: 100%;
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
}

th {
    background-color: #aa3d3d;
    color: white;
    text-transform: uppercase;
    font-size: 0.9rem;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

/* New CSS to style the action buttons */
.action-buttons {
    display: flex;
    gap: 8px;
    /* Adds space between buttons */
    justify-content: flex-start;
}

/* Common style for all action buttons */
.action-button {
    padding: 8px 12px;
    font-size: 0.9em;
    border-radius: 20px;
    /* Rounded corners for a softer look */
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-transform: capitalize;
}

.update-button {
    background-color: #3d8aaa;
}

.update-button:hover {
    background-color: #2b7095;
    transform: scale(1.05);
}

.delete-button {
    background-color: #f44336;
}

.delete-button:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
}

/* Style for the cancel button when in edit mode */
.cancel-button {
    background-color: #555;
    margin-left: 10px;
}

.cancel-button:hover {
    background-color: #333;
}
</style>
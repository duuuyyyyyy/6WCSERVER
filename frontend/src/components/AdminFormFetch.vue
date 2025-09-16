<template>
    <div>
        <div class="form-container">
            <h2>ADMIN</h2>
            <form @submit.prevent="submitAdminForm">
                <div class="form-group">
                    <div>
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" v-model="formData.firstName" name="firstName">
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" v-model="formData.lastName" name="lastName">
                    </div>
                </div>
                <label for="adminId">Admin ID:</label>
                <input type="text" id="adminId" v-model="formData.adminId" name="adminId">
                <label for="department">Department:</label>
                <input type="text" id="department" v-model="formData.department" name="department">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="formData.username" name="username">
                <label for="file">Select File:</label>
                <input type="file" id="file" @change="handleFileUpload" name="file">
                <button type="submit">{{ editingAdminId ? 'UPDATE & UPLOAD' : 'SUBMIT & UPLOAD' }}</button>
                <button v-if="editingAdminId" @click="resetForm" type="button" class="cancel-button">CANCEL</button>
            </form>
        </div>

        <div class="form-container">
            <h2>ADMIN DATA</h2>
            <div v-if="adminDataList.length" class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Admin ID</th>
                            <th>Department</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="admin in adminDataList" :key="admin.id">
                            <td>{{ admin.firstName }}</td>
                            <td>{{ admin.lastName }}</td>
                            <td>{{ admin.adminId }}</td>
                            <td>{{ admin.department }}</td>
                            <td>{{ admin.username }}</td>
                            <td class="action-buttons">
                                <button @click="editAdmin(admin)" class="action-button update-button">Update</button>
                                <button @click="deleteAdmin(admin.id)" class="action-button delete-button">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else>No admin data to display.</p>
        </div>

        <div v-if="error" class="form-container">
            <h2>Error</h2>
            <p>Something went wrong: {{ error }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "AdminFormFetcher",
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                adminId: '',
                department: '',
                username: ''
            },
            file: null,
            adminDataList: [],
            error: null,
            editingAdminId: null,
        };
    },
    created() {
        this.getAllAdminData();
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        submitAdminForm() {
            const formData = new FormData();
            for (const key in this.formData) {
                formData.append(key, this.formData[key]);
            }
            if (this.file) {
                formData.append('file', this.file);
            }

            if (this.editingAdminId) {
                axios.put(`http://localhost:5000/updateAdmin/${this.editingAdminId}`, formData)
                    .then(res => {
                        console.log("Admin data updated successfully:", res.data);
                        this.error = null;
                        this.resetForm();
                        this.getAllAdminData();
                    })
                    .catch(err => {
                        console.error("Error updating admin data:", err.response ? err.response.data : err.message);
                        this.error = "Failed to update admin data.";
                    });
            } else {
                axios.post('http://localhost:5000/postAdmin', formData)
                    .then(res => {
                        console.log("Admin data submitted successfully:", res.data);
                        this.error = null;
                        this.resetForm();
                        this.getAllAdminData();
                    })
                    .catch(err => {
                        console.error("Error submitting admin data:", err.response ? err.response.data : err.message);
                        this.error = "Failed to submit admin data.";
                    });
            }
        },
        getAllAdminData() {
            axios.get('http://localhost:5000/getadminData')
                .then(res => {
                    this.adminDataList = res.data.data;
                    this.error = null;
                })
                .catch(err => {
                    console.error("Error fetching admin data:", err.response ? err.response.data : err.message);
                    this.error = "Failed to fetch admin data.";
                });
        },
        deleteAdmin(id) {
            if (confirm("Are you sure you want to delete this admin record?")) {
                axios.delete(`http://localhost:5000/deleteAdmin/${id}`)
                    .then(res => {
                        console.log("Admin deleted successfully:", res.data);
                        this.error = null;
                        this.getAllAdminData();
                    })
                    .catch(err => {
                        console.error("Error deleting admin:", err.response ? err.response.data : err.message);
                        this.error = "Failed to delete admin record.";
                    });
            }
        },
        editAdmin(admin) {
            this.formData = { ...admin };
            this.editingAdminId = admin.id;
        },
        resetForm() {
            this.formData = {
                firstName: '',
                lastName: '',
                adminId: '',
                department: '',
                username: '',
            };
            this.file = null;
            this.editingAdminId = null;
        }
    }
};
</script>

<style scoped>
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
    gap: 8px; /* Adds space between buttons */
    justify-content: flex-start;
}

/* Common style for all action buttons */
.action-button {
    padding: 8px 12px;
    font-size: 0.9em;
    border-radius: 20px; /* Rounded corners for a softer look */
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
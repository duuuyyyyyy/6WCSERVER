<template>
    <div>
        <div class="form-container">
            <h2>STUDENT</h2>
            <form @submit.prevent="fetchStudentData">
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
                <button type="submit">SUBMIT</button>
            </form>
        </div>

        <div v-if="studentData" class="form-container">
            <h2>STUDENT DATA</h2>
            <pre>{{ JSON.stringify(studentData, null, 2) }}</pre>
        </div>

        <div v-if="studentError" class="form-container">
            <h2>Error</h2>
            <p>Something went wrong: {{ studentError }}</p>
        </div>

        <div class="form-container">
            <h2>FILE UPLOAD</h2>
            <form @submit.prevent="uploadFile">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="fileFormData.username" name="username">
                <label for="file">Select File:</label>
                <input type="file" id="file" @change="handleFileUpload" name="file">
                <button type="submit">Upload</button>
            </form>
        </div>

        <div v-if="fileUploadResponse" class="form-container">
            <h2>Upload Status</h2>
            <p>{{ fileUploadResponse }}</p>
        </div>

        <div v-if="fileUploadError" class="form-container">
            <h2>Error</h2>
            <p>Something went wrong: {{ fileUploadError }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

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
            studentData: null,
            studentError: null,

            fileFormData: {
                username: '',
            },
            uploadedFile: null,
            fileUploadResponse: null,
            fileUploadError: null,
        };
    },
    methods: {
        fetchStudentData() {
            axios.get('http://localhost:5000/getstudentForm', {
                params: this.studentFormData
            })
            .then(res => {
                this.studentData = res.data;
                this.studentError = null;
            })
            .catch(err => {
                console.error("Error fetching student data:", err);
                this.studentError = "Failed to fetch student data.";
                this.studentData = null;
            });
        },
        handleFileUpload(event) {
            this.uploadedFile = event.target.files[0];
        },
        async uploadFile() {
            if (!this.uploadedFile || !this.fileFormData.username) {
                this.fileUploadError = "Please select a file and enter a username.";
                return;
            }

            const formData = new FormData();
            formData.append('username', this.fileFormData.username);
            formData.append('file', this.uploadedFile);

            try {
                const res = await axios.post('http://localhost:5000/postAdmin', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.fileUploadResponse = res.data;
                this.fileUploadError = null;
                console.log("File uploaded successfully:", res.data);
            } catch (err) {
                console.error("Error uploading file:", err);
                this.fileUploadError = "Failed to upload file.";
                this.fileUploadResponse = null;
            }
        }
    }
};
</script>

<style scoped>
/* Your existing styles are fine and do not need to be changed. */
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

input, select {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1em;
}

input[type="submit"] {
    background-color: #aa3d3d;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 25px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: auto;
    margin-top: 10px;
}

input[type="submit"]:hover {
    background-color: #8a2b2b;
}

input:focus, select:focus {
    outline: none;
    border-color: #aa3d3d;
    box-shadow: 0 0 5px rgba(170, 61, 61, 0.5);
}

button {
    background-color: #aa3d3d;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 25px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #8a2b2b;
}

.form-group {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-group > div {
    flex: 1;
}

.form-group label {
    display: block;
    text-align: left;
}
</style>
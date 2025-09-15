<template>
    <div>
        <div class="form-container">
            <h2>ADMIN</h2>
            <form @submit.prevent="fetchAdminData">
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
                <button type="submit">SUBMIT</button>
            </form>
        </div>

        <div v-if="adminData" class="form-container">
            <h2>ADMIN DATA</h2>
            <pre>{{ JSON.stringify(studentData, null, 2) }}</pre>
        </div>

        <div v-if="error" class="form-container">
            <h2>Error</h2>
            <p>Something went wrong: {{ error }}</p>
        </div>

        <div class="form-container">
            <h2>FILE UPLOAD</h2>
            <form>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username">
                <label for="file">Select File:</label>
                <input type="file" id="file" name="file">
                <input type="submit" value="Upload">
            </form>
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
                department: ''
            },
            adminData: null,
            error: null,
        };
    },
    methods: {
        fetchAdminData() {
            axios.get('http://localhost:5000/getstudentForm', {
                params: this.formData
            })
            .then(res => {
                this.adminData = res.data;
                this.error = null;
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                this.error = "Failed to fetch admin data.";
                this.adminData = null;
            });
        },
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
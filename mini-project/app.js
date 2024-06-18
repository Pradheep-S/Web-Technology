    const http = require('http');
    const url = require('url');
    const querystring = require('querystring');
    const { MongoClient } = require('mongodb');

    // MongoDB connection URI
    const uri = 'mongodb://localhost:27017'; // Replace 'localhost' and '27017' with your MongoDB server details
    const client = new MongoClient(uri);

    // Connect to MongoDB
    async function connectDB() {
        try {
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    connectDB();

    async function onRequest(req, res) {
        const path = url.parse(req.url).pathname;
        console.log('Request for ' + path + ' received');

        const query = url.parse(req.url).query;
        const params = querystring.parse(query);
        const username = params["username"];
        const gender = params["gender"];
        const age = params["age"];
        const desc = params["desc"];


        const mobile = params["mobile"];
        const email = params["email"];
    
        if (req.url.includes("/insert")) {
            await insertData(req, res, username, mobile,gender,age,email,desc);
        } else if (req.url.includes("/delete")) {
            await deleteData(req, res,username);
        } else if (req.url.includes("/update")) {
            await updateData(req, res,username, mobile);
        } else if (req.url.includes("/display")) {
            await displayTable(req, res);
        }
    }

    async function insertData(req, res, username, mobile,age,gender,email,desc) {
        try {
            const database = client.db('eyeDonors'); // Replace 'yourDatabaseName' with your actual database name
            const collection = database.collection('donors');

            const students = {
                username,
                age,
                mobile,
                email,
                gender,
                desc
            };

            const result = await collection.insertOne(students);
            console.log('${result.insertedCount} document inserted');

            // HTML content for displaying the message in a table
            const htmlResponse = `
                <html>
                    <head>
                        <title>User Details</title>
                        <style>
                        /* General styles */
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    /* Header styles */
    h2 {
        margin-bottom: 20px;
    }

    /* Table styles */
    table {
        width: 80%;
        border-collapse: collapse;
        margin-bottom: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    th, td {
        padding: 12px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    /* Link styles */
    a {
        text-decoration: none;
        color: #007BFF;
        font-weight: bold;
    }

    a:hover {
        text-decoration: underline;
    }

    /* Center content */
    body, html {
        height: 100%;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    table, h2, a {
        margin: 20px;
    }
    </style>
                    </head>
                    <body>
                        <h2>Your Data</h2>
                        <table>
                            <tr>
                                <th>Field</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>Username</td>
                                <td>${username}</td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td>${gender}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>${age}</td>
                            </tr>
                            <tr>
                                <td>Mobile No</td>
                                <td>${mobile}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>${email}</td>
                            </tr>
                            
                            
                        
                        </table>
                        <a href="/display">View the list of donors</a>
                    </body>
                </html>
            `;

            // Write the HTML response
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlResponse);
            res.end();
        } catch (error) {
            console.error('Error inserting data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }

    async function deleteData(req, res, username) {
        try {
            const database = client.db('eyeDonors'); // Replace 'yourDatabaseName' with your actual database name
            const collection = database.collection('donors');

            // Construct the filter based on the employee ID
            const filter = { username:username };

            const result = await collection.deleteOne(filter);
            console.log('${result.deletedCount} document deleted');

            // Respond with appropriate message
            if (result.deletedCount === 1) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Document deleted successfully');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Document not found');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }

    async function updateData(req, res,username, newPhoneno) {
        try {
            const database = client.db('eyeDonors'); // Replace 'yourDatabaseName' with your actual database name
            const collection = database.collection('donors');

            // Construct the filter based on the employee ID
            const filter = { username:username};

            // Construct the update operation to set the new phoneno
            const updateDoc = {
                $set: { mobile: newPhoneno} // Assuming 'mobileNo' is the field to update
                
            };

            const result = await collection.updateOne(filter, updateDoc);
            console.log('${result.modifiedCount} document updated');

            // Respond with appropriate message
            if (result.modifiedCount === 1) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Details updated successfully');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Employee ID not found');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
    async function displayTable(req, res) {
        try {
            const database = client.db('eyeDonors'); // Replace 'yourDatabaseName' with your actual database name
            const collection = database.collection('donors');

            const cursor = collection.find({});
            const employees = await cursor.toArray();

            // Generate HTML table dynamically based on retrieved documents
            let tableHtml = `
                <!DOCTYPE html>
    <html lang="en">
    <head>
        
        
        <title>Register</title>
        
        <style>
            nav ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: #333;
            }
                /* styles.css */

    /* General styles */
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
    }

    /* Navigation styles */
    nav {
        background-color: #444;
    }

    nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        background-color: #333;
    }

    nav ul li {
        margin: 0;
    }

    nav ul li a {
        display: block;
        padding: 15px 20px;
        color: #fff;
        text-decoration: none;
    }

    nav ul li a:hover {
        background-color: #555;
    }

    /* Main content styles */
    main {
        padding: 20px;
        text-align: center;
    }

    main h1 {
        font-size: 2em;
        margin-bottom: 20px;
    }

    main p {
        font-size: 1.1em;
        margin-bottom: 20px;
    }

    main ul {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
    }

    main ul li {
        margin-bottom: 10px;
    }

    main ul li:before {
        content: "• ";
        color: #444;
    }


            nav ul li {
                float: left;
            }

            nav ul li a {
                display: block;
                color: white;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
            }

            nav ul li a:hover {
                background-color: #ddd;
                color: black;
            }

            .button-link {
                display: block;
                
                padding: 14px 16px;
                background-color: #333;
                color: white;
                text-align: center;
                text-decoration: none;
                
            }

            .button-link:hover {
                background-color:#ddd;
            }
                table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        
                        th, td {
                            padding: 10px;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                        }
                        
                        th {
                            background-color: #f2f2f2;
                            text-align: center;
                        }
                        
        </style>
    </head>
    <body>
        <br><br>
                        <table>
                            <tr>
                                <th>Username</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Mobile No</th>
                                <th>Email</th>
                                <th colspan="3">Reason to donate</th>
                            </tr>
            `;
            employees.forEach(employee => {
                tableHtml += `
                    <tr>
                        <td>${employee.username}</td>
                        <td>${employee.gender}</td>
                        <td>${employee.age}</td>
                        <td>${employee.mobile}</td>
                        <td>${employee.email}</td>
                        <td>${employee.desc}</td>
                    
                    </tr>
                `;
            });
            tableHtml += `
                        </table>
                    </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(tableHtml);
            res.end();
        } catch (error) {
            console.error('Error displaying table:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }

    // Create HTTP server
    http.createServer(onRequest).listen(7050);
    console.log('Server is running...');
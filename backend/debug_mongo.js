const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
console.log("Testing connection into: " + uri);

const options = {
    family: 4, // Force IPv4
    serverSelectionTimeoutMS: 5000 // Timeout faster
};

mongoose.connect(uri, options)
    .then(() => {
        console.log('Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
        console.error('Full Error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        process.exit(1);
    });

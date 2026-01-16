const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('--- MongoDB Connection Test ---');

// Manually load .env.local
let uri = process.env.MONGODB_URI;

if (!uri) {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/^MONGODB_URI=(.*)$/m);
            if (match) {
                uri = match[1].trim();
                // Remove quotes if present
                if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
                    uri = uri.slice(1, -1);
                }
            }
        }
    } catch (err) {
        console.error('Error reading .env.local:', err.message);
    }
}

if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in process.env or .env.local');
    process.exit(1);
}

console.log(`URI loaded: ${uri.substring(0, 15)}...`);

async function testConnection() {
    try {
        console.log('Attempting to connect...');
        // Set a short timeout to fail fast
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            family: 4 // Force IPv4 to avoid potential IPv6 issues
        });
        console.log('SUCCESS: Connected to MongoDB!');
        console.log('Connection state:', mongoose.connection.readyState);
        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('\nCONNECTION FAILED:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
        console.error('\nFull Error:', error);
    }
}

testConnection();

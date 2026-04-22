const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const doubtRoutes = require('./routes/doubtRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doubts', doubtRoutes);

console.log('--- Server Startup ---');
const PORT = process.env.PORT || 5000;
console.log(`Attempting to listen on port: ${PORT}`);

try {
    app.listen(PORT, () => {
        console.log(`SUCCESS: Server is actually running and listening on port ${PORT}`);
    });
} catch (err) {
    console.error('CRITICAL: Failed to start listener:', err);
}

console.log('Database: Using Supabase (Postgres)');

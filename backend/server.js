const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//logging middleware (server logs to the terminal)
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url} - ${res.statusCode}`);
    next();
})

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');
const dashboardRoutes = require('./routes/dashboard');

//health check endpoint
app.get('/api', (req, res) => {
    res.status(200).json({status: 'OK', timestamp: new Date()});
});

//route handlers
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/stores', storeRoutes);

app.use('/api/ratings', ratingRoutes);

app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

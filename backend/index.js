const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const labRoutes = require('./routes/labRoutes');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api/labs', labRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

// // server/server.js
// require('dotenv').config(); // Load GOOGLE_API_KEY

// const express = require('express');
// const cors = require('cors');
// const { google } = require('googleapis');

// const app = express();
// const PORT = process.env.PORT;

// // Middleware
// app.use(cors()); // Allows all domains to access this API (good for development)
// app.use(express.json()); // To parse incoming JSON requests

// // 1. Initialize the Google API client
// const factcheck = google.factchecktools({
//   version: 'v1alpha1',
//   auth: process.env.GOOGLE_API_KEY,
// });

// console.log()

// // 2. The Search Route
// app.get('/api/search', async (req, res) => {
//   const query = req.query.q || ''; // Get search query 'q' from URL (e.g., /api/search?q=claim)
  
//   try {
//     const apiResponse = await factcheck.claims.search({
//       query: query,
//       languageCode: 'en',
//       pageSize: 10,
//     });
    
//     // Send only the relevant claims data back to React
//     res.json(apiResponse.data.claims || []); 
//   } catch (error) {
//     console.error('Fact Check API Error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch data from external API.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const query = req.query.q || '';

  try {
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${process.env.GOOGLE_API_KEY}&query=${encodeURIComponent(query)}&languageCode=en&pageSize=10`;

    const response = await axios.get(url);

    res.json(response.data.claims || []);
  } catch (err) {
    console.error("FactCheck API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "API request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

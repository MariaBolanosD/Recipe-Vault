const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Route to Recipe Service
app.use("/recipes", async (req, res) => {
  console.log("Request received at Gateway:", req.method, req.url, req.body); // Debug log
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3000/recipes${req.url.replace("/recipes", "")}`, // Ensure the correct URL
      data: req.body,
    });
    console.log("Response from Recipe Service:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Error in Gateway:", err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});

app.use("/favorites", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3000/favorites${req.url.replace("/favorites", "")}`, // Ensure the correct URL
      data: req.body,
    });
    console.log("Response from Recipe Service:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Error in Gateway:", err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});

app.use('/protected-route', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: 'http://localhost:5000/protected', // Adjust to your service
      data: req.body,
      headers: {
        Authorization: req.headers.authorization, // Forward token
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || 'Server error');
  }
});

app.use("/favorites/:id", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5000/favorites/${req.params.id}`,
      headers: req.headers,
      withCredentials: true,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error in Gateway Favorites Route:", err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});


// Start the Gateway
app.listen(4000, () => {
  console.log("API Gateway running on port 4000");
});

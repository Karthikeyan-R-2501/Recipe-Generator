// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const axios = require('axios');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 5000;
const API_KEY = 'your_api_key';
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

app.use(cors());
app.use(express.json());

app.post('/predict', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No image uploaded' });
  }

  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: [req.file.buffer.toString('base64')]
  };

  PythonShell.run('predict.py', options, function (err, results) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.send({ ingredients: JSON.parse(results[0]) });
  });
});

app.post('/recipes', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) {
    return res.status(400).send({ error: 'No ingredients provided' });
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        ingredients: ingredients.join(','),
        number: 5,
        apiKey: API_KEY
      }
    });
    res.send({ recipes: response.data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const dataFilePath = path.join(__dirname, './persons.json');

// Read data from the file
const readData = () => {
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading or parsing data:', error);
      return [];
    }
  };

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(readData())
  })

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

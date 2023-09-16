const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const dataFilePath = path.join(__dirname, './persons.json')

// Read data from the file
const readData = () => {
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading or parsing data:', error)
      return []
    }
  }

  const saveData = (data) => {
    try {
        const stringifiedData = JSON.stringify(data, null, 2)
        fs.writeFileSync(dataFilePath, stringifiedData)
    } catch (error) {
        console.error('Error writing data:', error)
    }
}


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    const count=readData().length
    const date=new Date().toString()
    response.send(`<p><h1>Phonebook has info for ${count} people</h1> <br/>
                    <span>${date}</span>
                </p>`)
  })

app.get('/api/persons', (request, response) => {
    response.json(readData())
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id); 
    const person =readData().find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const data= readData()
    persons = data.filter(p=> p.id !== id)

        saveData(persons)
        response.status(204).end()
   
  })


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

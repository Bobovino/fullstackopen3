const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const dataFilePath = path.join(__dirname, './persons.json')

app.use(express.json());   

// Read/Write data from the file
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

//Create--------------------------------------------

const generateId = () => {
    data=readData()
    const maxId = data.length > 0
      ? Math.max(...data.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post('/api/persons', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    const body = request.body
    console.log('Received body:', request.body);
    let data= readData()

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
      important: body.important || false,
      
    }
  
    data = data.concat(person)
    saveData(data)
    response.json(person)
  })


//READ--------------------------------------------
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

//DELETE--------------------------------------------

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

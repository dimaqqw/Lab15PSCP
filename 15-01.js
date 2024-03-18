const express = require('express')
const app = express()
const expbs = require('express-handlebars')
const fs = require('fs').promises

const PORT = 3000
const path = 'data.json'

app.use(express.json())
app.use(express.static('public'))
app.engine(
  'handlebars',
  expbs.engine({
    defaultLayout: 'main',
    helpers: {
      declineAction: () => {
        return "window.location.href = '/';"
      },
    },
  })
)
app.set('view engine', 'handlebars')

async function readData() {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}

// Отображается форма GET:/
app.get('/', async (req, res) => {
  const data = await readData()
  res.render('index', {
    title: 'GET:/',
    data: data || [],
  })
})
// Отображается форма GET:/Add
app.get('/Add', async (req, res) => {
  const data = await readData()
  res.render('add', {
    title: 'GET:/Add',
    data: data || [],
  })
})
// Добавляет строку в json-файл, в ответе форма GET:/
app.post('/Add', async (req, res) => {
  console.log('post add')
  try {
    const id = await readData()
    const lastElementId = id[id.length - 1].id + 1
    // console.log(id.length)
    const newData = {
      name: req.body.name,
      number: req.body.number,
      id: lastElementId,
    }
    const jsonData = await fs.readFile(path, 'utf8')
    const existingData = JSON.parse(jsonData)
    existingData.push(newData)
    await fs.writeFile(path, JSON.stringify(existingData, null, 2))
    res.status(200).send('Data added successfully!')
  } catch (error) {
    console.error('Error adding data:', error)
    res.status(500).send('Error adding data')
  }
})
// Отображается форма GET:/Update
app.get('/Update/:name/:number/:id', async (req, res) => {
  const data = await readData()
  console.log(req.params.name)
  console.log(req.params.number)
  console.log(req.params.id)
  const forUpdateString = {
    name: req.params.name,
    number: req.params.number,
    id: req.params.id,
  }
  res.render('update', {
    title: 'GET:/Update',
    data: data || [],
    dataForUpdateString: forUpdateString,
  })
})
// Изменяет строку в json-файле, в ответе форма GET:/
app.post('/Update', async (req, res) => {
  try {
    const { id, name, number } = req.body
    const data = await readData()
    const updatedData = data.map((item) => {
      if (item.id === parseInt(id)) {
        return { id: parseInt(id), name, number }
      }
      return item
    })
    await fs.writeFile(path, JSON.stringify(updatedData, null, 2))
    res.status(200).send('Data updated successfully!')
  } catch (error) {
    console.error('Error updating data:', error)
    res.status(500).send('Error updating data')
  }
  res.redirect('/')
})

// Удаляет строку в json-файле, в ответе форма GET:/
app.post('/Delete', async (req, res) => {
  try {
    const { id } = req.body
    console.log(id)
    const data = await readData()
    const updatedData = data.filter((item) => item.id !== parseInt(id))
    console.log(updatedData)
    await fs.writeFile(path, JSON.stringify(updatedData, null, 2))
    res.redirect('/')
  } catch (error) {
    console.error('Error deleting data:', error)
  }
})

app.listen(PORT, () => {
  console.log('http://localhost:3000/')
})

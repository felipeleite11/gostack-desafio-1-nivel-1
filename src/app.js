const express = require("express")
const cors = require("cors")

const { uuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

const existsValidationMiddleware = (req, res, next) => {
  const { id } = req.params

  let repository = repositories.find(repo => repo.id === id)

  if(!repository) {
    return res.status(400).json({ msg: 'Repositoty is not found.' })
  }

  return next()
}

app.get("/repositories", (req, res) => {
  return res.json(repositories)
})

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return res.json(repository)
})

app.put("/repositories/:id", existsValidationMiddleware, (req, res) => {
  const { id } = req.params
  const { title, url, techs } = req.body

  let repository = repositories.find(repo => repo.id === id)

  const { likes } = repository

  repository = {
    id, title, url, techs, likes
  }

  return res.json(repository)
})

app.delete("/repositories/:id", existsValidationMiddleware, (req, res) => {
  const { id } = req.params
  
  const index = repositories.findIndex(repo => repo.id === id)

  repositories.splice(index, 1)
  
  return res.status(204).send()
})

app.post("/repositories/:id/like", existsValidationMiddleware, (req, res) => {
  const { id } = req.params

  const repository = repositories.find(repo => repo.id === id)

  repository.likes++

  return res.json(repository)
})

module.exports = app

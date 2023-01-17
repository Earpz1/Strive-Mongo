import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import postsRouter from '../api/posts/index.js'

const server = express()
const port = process.env.PORT || 3001

//Middleware
server.use(cors())
server.use(express.json())

// Endpoints
server.use('/posts', postsRouter)

//Connect to the mongoose DB
mongoose.connect(process.env.MONGO_DB_URL)

//Check if the database connected and if so, start the server

mongoose.connection.on('connected', () => {
  server.listen(port, () => {
    console.log(
      `Server is running on port ${port} and the database is connected`,
    )
  })
})

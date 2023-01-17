import mongoose from 'mongoose'

const { Schema, model } = mongoose

const authorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String },
})

export default model('authorModel', authorSchema)

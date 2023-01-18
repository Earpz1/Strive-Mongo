import mongoose from 'mongoose'

const { Schema, model } = mongoose

const commentSchema = new Schema({
  comment: { type: String, required: true },
})

export default model('commentSchema', commentSchema)

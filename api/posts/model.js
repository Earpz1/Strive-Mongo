import mongoose, { SchemaType } from 'mongoose'

const { Schema, model } = mongoose

const commentSchema = new Schema(
  {
    comment: { type: String },
  },
  {
    timestamps: true,
  },
)

const postSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: [
      { type: Schema.Types.ObjectId, required: true, ref: 'authorModel' },
    ],
    comments: [commentSchema],
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model('postsModel', postSchema)

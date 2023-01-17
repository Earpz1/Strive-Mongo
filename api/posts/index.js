import express from 'express'
import { model } from 'mongoose'
import postsModel from './model.js'
import createHttpError from 'http-errors'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

const blogCoverPhoto = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'StriveBlog',
    },
  }),
}).single('cover')

const postsRouter = express.Router()

postsRouter.post('/', async (request, response, next) => {
  try {
    const newPost = new postsModel(request.body)
    const { _id } = await newPost.save()
    response.status(200).send({ _id })
  } catch (error) {
    next(error)
  }
})

postsRouter.get('/', async (request, response, next) => {
  try {
    const posts = await postsModel.find({})
    response.status(200).send(posts)
  } catch (error) {
    next(error)
  }
})

postsRouter.get('/:postID', async (request, response, next) => {
  try {
    const post = await postsModel.findById(request.params.postID)
    response.status(200).send(post)
  } catch (error) {
    next(error)
  }
})

postsRouter.put('/:postID', async (request, response, next) => {
  try {
    const post = await postsModel.findByIdAndUpdate(
      request.params.postID,
      request.body,
      { new: true },
    )
    response.status(200).send(post)
  } catch (error) {
    next(error)
  }
})

postsRouter.delete('/:postID', async (request, response, next) => {
  try {
    const deletedPost = await postsModel.findByIdAndDelete(
      request.params.postID,
    )
    if (deletedPost) {
      response.status(204).send()
    } else {
      next(createHttpError(404, `User with ID ${request.params.id} not found`))
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.post(
  '/:postID/uploadCover',
  blogCoverPhoto,
  async (request, response, next) => {
    try {
      const url = request.file.path

      const post = await postsModel.findByIdAndUpdate(request.params.postID, {
        cover: url,
      })
      response.status(200).send('File Uploaded')
    } catch (error) {
      next(error)
    }
  },
)

export default postsRouter

import express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import postModel from '../posts/model.js'
import userModel from './model.js'

const avatarPhoto = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'StriveBlog',
    },
  }),
}).single('avatar')

const authorsRouter = express.Router()

authorsRouter.post('/', async (request, response, next) => {
  try {
    const newUser = await userModel(request.body)
    const { _id } = await newUser.save()
    response.status(200).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.post(
  '/uploadAvatar',
  avatarPhoto,
  async (request, response, next) => {
    try {
      const url = request.file.path
      const changeAvatar = await postModel.updateMany(
        { 'author.name': 'Daniel Earp' },
        { $set: { 'author.avatar': url } },
      )
      response.status(200).send('File Uploaded')
    } catch (error) {
      next(error)
    }
  },
)

export default authorsRouter

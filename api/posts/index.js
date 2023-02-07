import express from 'express'
import { model } from 'mongoose'
import postsModel from './model.js'
import commentSchema from '../comments/model.js'
import createHttpError from 'http-errors'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import uniqid from 'uniqid'
import { AuthMiddleware } from '../../lib/auth.js'

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

postsRouter.get('/', AuthMiddleware, async (request, response, next) => {
  try {
    const posts = await postsModel.find({}).limit(request.query.limit)
    response.status(200).send(posts)
  } catch (error) {
    next(error)
  }
})

postsRouter.get('/:postID', async (request, response, next) => {
  try {
    const post = await postsModel
      .findById(request.params.postID)
      .populate({ path: 'author' })
    if (post) {
      response.send(post)
    } else {
      next(
        createHttpError(
          404,
          `Unable to find a post with the ID ${request.params.postID}`,
        ),
      )
    }
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

postsRouter.get('/:postID/comments', async (request, response, next) => {
  try {
    const post = await postsModel.findById(request.params.postID)
    if (post) {
      console.log(post)
      response.status(200).send(post.comments)
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.post('/:postID', async (request, response, next) => {
  try {
    const blogPost = await postsModel.findById(request.params.postID, {
      _id: 0,
    })

    if (blogPost) {
      const updateComments = await postsModel.findByIdAndUpdate(
        request.params.postID,
        { $push: { comments: request.body } },
        { new: true },
      )
      response
        .status(200)
        .send(`New comment has been added to ${request.params.postID}`)
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.get(
  '/:postID/comments/:commentID',
  async (request, response, next) => {
    try {
      const blogPost = await postsModel.findById(request.params.postID)

      if (blogPost) {
        const singleComment = blogPost.comments.find(
          (comment) => comment._id.toString() === request.params.commentID,
        )
        console.log(singleComment)
        response.send(singleComment)
      } else {
        next(
          createHttpError(
            404,
            `The comment you are trying to find does not exist`,
          ),
        )
      }
    } catch (error) {
      next(error)
    }
  },
)

postsRouter.put(
  '/:postID/comments/:commentID',
  async (request, response, next) => {
    try {
      const post = await postsModel.findById(request.params.postID)
      console.log(request.body)

      if (post) {
        const index = post.comments.findIndex(
          (comment) => comment._id.toString() === request.params.commentID,
        )

        if (index !== -1) {
          post.comments[index] = {
            ...post.comments[index].toObject(),
            ...request.body,
          }
          await post.save()
          response.send(post)
        }
      }
    } catch (error) {
      next(error)
    }
  },
)

postsRouter.delete(
  '/:postID/comments/:commentID',
  async (request, response, next) => {
    try {
      const removeComment = await postsModel.findByIdAndUpdate(
        request.params.postID,
        { $pull: { comments: { _id: request.params.commentID } } },
        { new: true },
      )
      if (removeComment) {
        response.send(removeComment)
      }
    } catch (error) {
      next(error)
    }
  },
)

export default postsRouter

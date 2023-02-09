import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import userModel from '../api/authors/model.js'
import atob from 'atob'

export const createAccesstoken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (error, token) => {
        if (error) reject(error)
        else resolve(token)
      },
    ),
  )

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (error, originalPayload) => {
      if (error) reject(error)
      else resolve(originalPayload)
    }),
  )

export const basicAuthMiddleware = async (request, response, next) => {
  if (!request.headers.authorization) {
    next(createHttpError(401, 'Please enter login details'))
  } else {
    const encodedCredentials = request.headers.authorization.split(' ')[1]

    const credentials = atob(encodedCredentials)

    const { email, password } = credentials.split(':')

    const user = await userModel.checkDetails(email, password)

    if (user) {
      request.user = user
    } else {
      next(createHttpError(401, 'Credentials not okay'))
    }
  }
}

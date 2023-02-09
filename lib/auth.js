import { verifyAccessToken } from './tools.js'
import createHttpError from 'http-errors'

export const AuthMiddleware = async (request, response, next) => {
  if (!request.headers.authorization) {
    next(createHttpError(401, 'Please enter login details'))
  } else {
    try {
      const accessToken = request.headers.authorization.replace('Bearer ', '')

      const payload = await verifyAccessToken(accessToken)

      request.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
    } catch (error) {
      console.log(error)
      next(createHttpError(401, 'Token not valid'))
    }
  }
}

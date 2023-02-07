import atob from 'atob'
import userModel from '../api/authors/model.js'
import createHttpError from 'http-errors'

export const AuthMiddleware = async (request, response, next) => {
  if (!request.headers.authorization) {
    next()
  } else {
    const encodedDetails = request.headers.authorization.split(' ')[1]

    const loginDetails = atob(encodedDetails)
    console.log(loginDetails)
    const [email, password] = loginDetails.split(':')
    console.log(email + password)

    const user = await userModel.checkDetails(email, password)

    if (user) {
      request.user = user
      next()
    } else {
      next(createHttpError(401, 'Login details not okay'))
    }
  }
}

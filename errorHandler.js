import mongoose from 'mongoose'

export const notFoundHandler = (error, request, response, next) => {
  if (error.status === 404 || error instanceof mongoose.Error.CastError) {
    response
      .status(404)
      .send({ message: `The ID you have supplied is invalid` })
  } else {
    next(error)
  }
}

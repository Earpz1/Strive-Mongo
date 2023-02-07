import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String },
})

userSchema.pre('save', async function (next) {
  const currentUser = this

  if (currentUser.isModified('password')) {
    const plainPW = currentUser.password
    const hash = await bcrypt.hash(plainPW, 10)
    currentUser.password = hash
  }
  next()
})

userSchema.static('checkDetails', async function (email, password) {
  const user = await this.findOne({ email })

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model('userModel', userSchema)

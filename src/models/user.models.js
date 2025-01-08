import {Schema, model} from 'mongoose'

const userSchema = new Schema({
  title: {
    type: String,
    unique: true
  }
})

export const userModel = model("users", userSchema)
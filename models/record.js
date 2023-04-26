import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  body: { type: String, required: true, maxLength: 20 },
  commenter: { type: Schema.Types.ObjectId, ref: "Profile"},
})

const likeSchema = new Schema({
  liker: { type: Schema.Types.ObjectId, ref: "Profile"}
})

const recordSchema = new Schema({
  title: { type: String },
  artist: { type: String },
  year: { type: Number },
  owner: { type: Schema.Types.ObjectId, ref: 'Profile' },
  art: { type: String },
  comments: [commentSchema],
  likes: [likeSchema]
}, {
  timestamps: true
})

const Record = mongoose.model('Record', recordSchema)

export {
  Record
}

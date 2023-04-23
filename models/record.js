import mongoose from 'mongoose'

const Schema = mongoose.Schema

const recordSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number, min: 0, max: 2023, required: true },
  single: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Profile' }
}, {
  timestamps: true
})

const Record = mongoose.model('Record', recordSchema)

export {
  Record
}

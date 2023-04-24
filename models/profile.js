import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  avatar: String,
  followers: [{type: Schema.Types.ObjectId, ref: "Profile"}],
  following: [{type: Schema.Types.ObjectId, ref: "Profile"}],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}

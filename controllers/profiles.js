import { Profile } from "../models/profile.js"
import { Record } from "../models/record.js"

function index(req, res) {
  Profile.find({})
  .then(profiles => {
    console.log(profiles);
    res.render('profiles/index', {
      profiles,
      title: "Profiles"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Record.find({owner: profile})
    .then(records => {
      res.render('profiles/show', {
        profile,
        records,
        title: `${profile.name}'s Page`
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function follow(req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    req.body.follower = req.user.profile._id
    profile.followers.push(req.body.follower)
    profile.save()
    .then(() => {
      res.redirect(`/profiles/${profile._id}`)
    })
      .catch(err => {
      console.log(err)
      res.redirect('/profiles')
    })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/profiles')
    })
}

function unfollow(req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Profile.findById(req.params.followerId)
    .then(follower => {
      if (follower._id.equals(req.user.profile._id)) {
        profile.followers.remove(follower)
        profile.save()
        .then(() => {
          res.redirect(`/profiles/${profile._id}`)
        })
        .catch(err => {
          console.log(err)
          res.redirect('/profiles')
        })
      } else {
        throw new Error('🚫 Not authorized 🚫')
      }
    })
    .catch(err => {
      console.log(err)
      res.redirect('/profiles')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/profiles')
  })
}


export {
  index,
  show,
  follow,
  unfollow
}
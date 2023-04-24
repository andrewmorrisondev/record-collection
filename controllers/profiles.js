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


export {
  index,
  show
}
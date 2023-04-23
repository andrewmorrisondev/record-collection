import { Record } from "../models/record.js"

function index(req, res) {
  Record.find({})
  .then(records => {
    console.log(records);
    res.render('records/index', {
      records,
      title: "Records"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function newRecord(req, res) {
  Record.find({})
  .then(records => {
    res.render('records/new', {
      records,
      title: 'Add Record'
    })
  })
}

function create(req, res) {
  req.body.owner = req.user.profile._id
  req.body.tasty = !!req.body.tasty
  Record.create(req.body)
  .then(record => {
    res.redirect('/records')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
  index,
  newRecord as new,
  create
}
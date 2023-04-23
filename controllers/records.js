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

function edit(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    res.render('records/edit', {
      record,
      title: "Edit Record"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function update(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    if (record.owner.equals(req.user.profile._id)) {
      console.log(req.body);
      record.updateOne(req.body)
      .then(() => {
        res.redirect(`/records`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
    } else {
      console.log("Can't update a record that does not belong to you.")
      res.redirect('/')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
  index,
  newRecord as new,
  create,
  edit,
  update
}
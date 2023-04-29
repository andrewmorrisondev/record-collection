import { Record } from "../models/record.js"
import { fetchAlbumInfo } from "../src/services/api.js"

///////////////////////////////////////////////////////
// taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
///////////////////////////////////////////////////////
function shuffle(array) {
  let currentIndex = array.length,  randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array;
}
///////////////////////////////////////////////////////



function index(req, res) {
  Record.find({})
  .populate('owner')
  .then(records => {
    records = shuffle(records)
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

function show(req, res) {
  Record.findById(req.params.recordId)
  .populate([
    {path: "owner"},
    {path: "comments.commenter"},
    {path: "likes.liker"}
  ])
  .then(record => {
    res.render('records/show', {
      record,
      title: `${record.title}`
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
  fetchAlbumInfo(req.body.artist, req.body.title)
  .then(albumData => {
    if (albumData === undefined) {
      res.redirect('/records/new')
    } else {
      Record.find({ title: albumData.title, artist: albumData.artist })
      .then(records => {
        if (records.length) {
          res.redirect('/records/new')
        } else {
          albumData.owner = req.user.profile._id
          Record.create(albumData)
          .then((newRecord) => {
            res.redirect(`/records/${newRecord._id}`)
          })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          })
        }
      })
    }
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

function deleteRecord(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    if (record.owner.equals(req.user.profile._id)) {
      record.deleteOne(req.body)
      .then(() => {
        res.redirect(`/records`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
    } else {
      console.log("Can't delete a record that does not belong to you.")
      res.redirect('/')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function addComment(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    req.body.commenter = req.user.profile._id
    record.comments.push(req.body)
    record.save()
    .then(() => {
      res.redirect(`/records/${record._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/records')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/records')
  })
}

function editComment(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    const comment = record.comments.id(req.params.commentId)
    if (comment.commenter.equals(req.user.profile._id)) {
      res.render('records/editComment', {
        record, 
        comment,
        title: 'Update Comment'
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/records')
  })
}

function updateComment(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    const comment = record.comments.id(req.params.commentId)
    if (comment.commenter.equals(req.user.profile._id)) {
      comment.set(req.body)
      record.save()
      .then(() => {
        res.redirect(`/records/${record._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/records')
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/records')
  })
}

function deleteComment(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    const comment = record.comments.id(req.params.commentId)
    if (comment.commenter.equals(req.user.profile._id)) {
      record.comments.remove(comment)
      record.save()
      .then(() => {
        res.redirect(`/records/${record._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/records')
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/records')
  })
}

function likeRecord(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    req.body.liker = req.user.profile._id
    record.likes.push(req.body)
    record.save()
    .then(() => {
      res.redirect(`back`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('back')
    })
    })
    .catch(err => {
      console.log(err)
      res.redirect('back')
    })
}

function deleteLike(req, res) {
  Record.findById(req.params.recordId)
  .then(record => {
    const like = record.likes.id(req.params.likeId)
    if (like.liker.equals(req.user.profile._id)) {
      record.likes.remove(like)
      record.save()
      .then(() => {
        res.redirect(`back`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('back')
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('back')
  })
}

export {
  index,
  show,
  newRecord as new,
  create,
  edit,
  update,
  deleteRecord as delete,
  addComment,
  editComment,
  updateComment,
  deleteComment,
  likeRecord,
  deleteLike
}
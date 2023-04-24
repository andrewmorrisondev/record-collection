import { Router } from 'express'
import * as recordsCtrl from '../controllers/records.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

// GET localhost:3000/records
router.get('/', recordsCtrl.index)

// GET localhost:3000/records/new
router.get('/new', recordsCtrl.new)

// GET localhost:3000/records/:recordId
router.get('/:recordId', recordsCtrl.show)

// POST localhost:3000/records
router.post('/', isLoggedIn, recordsCtrl.create)

// GET localhost:3000/records/:recordId/edit
router.get('/:recordId/edit', isLoggedIn, recordsCtrl.edit)

// PUT localhost:3000/records/:recordId
router.put('/:recordId', isLoggedIn, recordsCtrl.update)

// DELETE localhost:3000/records/:recordId
router.delete('/:recordId', isLoggedIn, recordsCtrl.delete)

// POST localhost:3000/records/:recordId/comments
router.post('/:recordId/comments', isLoggedIn, recordsCtrl.addComment)

// GET localhost:3000/:recordId/comments/:commentId/edit
router.get('/:recordId/comments/:commentId/edit', isLoggedIn, recordsCtrl.editComment)

// PUT records/:recordId/comments/:commentId
router.put('/:recordId/comments/:commentId', isLoggedIn, recordsCtrl.updateComment)

export {
  router
}
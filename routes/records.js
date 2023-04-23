import { Router } from 'express'
import * as recordsCtrl from '../controllers/records.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

// ALL ROUTES in this file start with localhost:3000/records

// GET localhost:3000/records
router.get('/', recordsCtrl.index)

// GET localhost:3000/meals/new
router.get('/new', recordsCtrl.new)

// POST localhost:3000/records
router.post('/', isLoggedIn, recordsCtrl.create)

// GET localhost:3000/records/:recordId/edit
router.get('/:recordId/edit', isLoggedIn, recordsCtrl.edit)

// PUT localhost:3000/records/:recordId
router.put('/:recordId', isLoggedIn, recordsCtrl.update)

// DELETE localhost:3000/records/:recordId
router.delete('/:recordId', recordsCtrl.delete)

export {
  router
}
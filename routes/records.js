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

export {
  router
}

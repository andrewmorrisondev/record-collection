import { Router } from 'express'
import * as profilesCtrl from '../controllers/profiles.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

// GET localhost:3000/profiles
router.get('/', isLoggedIn, profilesCtrl.index)

// POST profiles/:profileId/follower
router.post('/:profileId/follower', isLoggedIn, profilesCtrl.follow)

// GET localhost:3000/profiles/:profileId
router.get('/:profileId', isLoggedIn, profilesCtrl.show)

// DELETE profiles/:profileId/follower/:follwerId
router.delete('/:profileId/follower/:followerId', isLoggedIn, profilesCtrl.unfollow)

export {
  router
}
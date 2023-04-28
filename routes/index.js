import { Router } from 'express'

const router = Router()

router.get('/', function (req, res) {
  // res.render('records', { title: 'Home Page' })
  res.redirect('/records')
})

export {
  router
}

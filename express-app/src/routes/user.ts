import { Router } from 'express'

const router = Router()

import ctrl from '../controllers/user'

router.post('/signIn', ctrl.signIn)
router.post('/signUp', ctrl.signUp)
router.post('/checkJwt', ctrl.checkJwt)

export default router
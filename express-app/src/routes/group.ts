import { Router } from 'express'

const router = Router()

import ctrl from '../controllers/group'

router.post('/add', ctrl.addGroup)
router.get('/get/:wallet', ctrl.getGroups)
router.post('/updateGroupSubWallets', ctrl.updateGroupSubWallets)
export default router
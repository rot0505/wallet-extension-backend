import { Router } from 'express'

const router = Router()

import ctrl from '../controllers/contract'

router.post('/funding', ctrl.funding)
router.post('/defunding', ctrl.defunding)
router.post('/mintNFT', ctrl.minting)
export default router
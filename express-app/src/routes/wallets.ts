import { Router } from 'express'

const router = Router()

import ctrl from '../controllers/wallets'

router.post('/add/:walletCount', ctrl.addSubWallet)
router.get('/get/:masterWallet', ctrl.getSubWallets)
router.post('/update', ctrl.updateSubWallet)
router.post('/updateContractList', ctrl.updateCotractsByWallet)
export default router
import { Router, Request, Response } from 'express';

const router = Router()

import userRoutes from './user'
import walletRoutes from './wallets'
import groupRoutes  from './group'
import contractRoutes from './contract'

// Backend 
router.get('/', (req: Request, res: Response) =>
  res.send('Server is working')
)

router.use('/user', userRoutes);
router.use('/group', groupRoutes);
router.use('/wallets', walletRoutes);
router.use('/contract', contractRoutes);

export default router;
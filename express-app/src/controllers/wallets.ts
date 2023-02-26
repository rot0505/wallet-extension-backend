import { Request, Response } from 'express';
import { BAD_REQUEST, BACKEND_ERROR } from '../constant';
import walletService from '../services/wallets';


const addSubWallet = async (req: Request, res: Response) => {
    try {
        if (req.body === undefined) {
            return res.status(400).json(BAD_REQUEST);
        }
        const subWalletCount = req.params;
        const result = await walletService.addSubWallet(req.body, subWalletCount.walletCount);
        return res.json({ success: true, message: 'Success', data: result });

    } catch (e) {
        return res.status(500).json(BACKEND_ERROR);
    }
}

const getSubWallets = async(req: Request, res: Response) => {
    try{
        const {masterWallet} = req.params;
        const result = await walletService.getSubWallets(masterWallet);
        return res.json({ success: true, message: 'Success', data: result });
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const updateSubWallet = async(req: Request, res: Response) => {
    try{
        const{walletId, nickName} = req.body;
        const result = await walletService.updateSubWallet(walletId, nickName);
        return res.json({ success: true, message: 'Success', data: result });
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const updateCotractsByWallet = async(req: Request, res: Response) => {
    try{
        const{contractAddress, walletId} = req.body;
        const result = await walletService.updateCotractsByWallet(contractAddress, walletId);
        return res.json({ success: true, message: 'Success', data: result });
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

export default{
    addSubWallet,
    getSubWallets,
    updateSubWallet,
    updateCotractsByWallet
}


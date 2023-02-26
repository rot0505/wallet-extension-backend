import { Request, Response } from 'express';
import { GASLIMIT_ERROR, BACKEND_ERROR } from '../constant';
import contractService from '../services/contract';


const funding = async(req: Request, res: Response) => {
    try{
        const {masterWallet, unitPrice, subWalletList} = req.body;
        const result = await contractService.funding(masterWallet, unitPrice, subWalletList);
        if(result == true){
            return res.json({ success: true, message: 'Success'});
        }
        else{
            return res.status(500).json(GASLIMIT_ERROR);
        }
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const defunding = async(req: Request, res: Response) => {
    try{
        const {masterWallet, subWalletList} = req.body;
        await contractService.defunding(masterWallet, subWalletList);
        return res.json({ success: true, message: 'Success'});
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const minting = async(req: Request, res: Response) => {
   try{
        const {selectedFunction, inputParams,  subWalletIdList, contractAddress} = req.body;
        const result = await contractService.minting(selectedFunction, inputParams, subWalletIdList, contractAddress);
        return res.json({ sucess: true, message: 'Success', result: result});
   }catch(e){
        return res.status(500).json(BACKEND_ERROR);
   }     
}

export default{
    funding,
    defunding,
    minting,
}
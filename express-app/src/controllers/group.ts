import { Request, Response } from 'express';
import { BACKEND_ERROR } from '../constant';
import groupService from '../services/group';

const addGroup = async(req: Request, res: Response) => {
    try{
        const result = await groupService.addGroup(req.body);
        return res.json({ success: true, message: 'Success', data: result });
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const getGroups = async(req: Request, res: Response) => {
    try{
        const wallet: any = req.params;
        const groups = await groupService.getGroupsByWallet(wallet);
        return res.json({ success: true, message: 'Success', data: groups });
    }
    catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const updateGroupSubWallets = async(req:Request, res: Response) => {
    try{
        const {groupId, subWalletList} = req.body;
        const result = await groupService.updateGroupSubWallets(groupId, subWalletList);
        return res.json({ success: true, message: 'Success', data: result});
    }
    catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
} 

export default{
    addGroup,
    getGroups,
    updateGroupSubWallets
}
import {GROUPS} from '../constant';
import Group from '../models/group';
import { SubWalletProp } from './interface';
const uuid = require('uuid')

const addGroup = async(body: any) => {
    const result = await Group.create({ id: uuid.v1(), ...body })
    return result;
}

const getGroupsByWallet = async(body : any) => {
    const groups = await Group.scan({ wallet : body.wallet}).exec();
    if(groups.count == 0)
    {
        let newGroups = [];
        for(let i = 0; i < GROUPS.length; i++)
        {
            let newGroup = { groupName: GROUPS[i], wallet: body.wallet, subWallets: []};
            let result = await addGroup(newGroup);
            newGroups.push(result);
        }
        return newGroups;
    }
    else
    {
        return groups;
    }
}

const updateGroupSubWallets = async(groupId: String, subWalletList: Array<SubWalletProp>) =>{
    const updateData = { "$SET": { "subWallets": subWalletList } }; 
    const groups = await Group.update({"id": groupId}, updateData);
    return groups;
}

export default {
    addGroup,
    getGroupsByWallet,
    updateGroupSubWallets,
}
import Wallets from '../models/wallets';
const uuid = require('uuid')
const ethers = require('ethers');

const addSubWallet = async (body: any, walletCount: String) => {
    let wallets = []
    const {masterWallet} = body
    for(let i = 0; i < Number(walletCount); i++)
    {
        let newWallet = await ethers.Wallet.createRandom();
        body.masterWallet = masterWallet;
        body.privateKey = newWallet.privateKey;
        body.nickName = newWallet.address;
        body.wallet = newWallet.address;
        body.contracts = [];
        const res = await Wallets.create({ id: uuid.v1(), ...body });
        delete res.privateKey;
        wallets.push(res);
    }
    return wallets;
}

const getSubWallets = async(masterWallet: String) => {
    const wallets = await Wallets.scan({masterWallet : masterWallet}).exec();
    return wallets
}

const updateSubWallet = async(walletId: String, nickName: String) => {
    const result = await Wallets.update({ id: walletId }, {nickName: nickName});
    delete result.privateKey;
    return result;
}

const updateCotractsByWallet = async(contractAddress: String, walletId: String) => {
    const wallets = await Wallets.scan({id: walletId}).exec();
    const contractIndex: number = wallets[0].contracts.findIndex((item: String) =>
        item === contractAddress
    )
    if(contractIndex === -1)
    {
        let newContracts = wallets[0].contracts;
        newContracts.push(contractAddress);
        const result = await Wallets.update({id: walletId}, {contracts: newContracts});
        return result;
    }
    return wallets[0].contracts;
}

export default {
    addSubWallet,
    getSubWallets,
    updateSubWallet,
    updateCotractsByWallet
}
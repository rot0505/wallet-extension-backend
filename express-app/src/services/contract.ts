import User from '../models/user';
import Wallets from '../models/wallets';
import axios from "axios";
import { RPC_URL, ContractURL } from '../constant';
import { NFT_ABI } from '../constant/abi/abi';
import { WalletProp } from './interface';
const {ethers,providers, Contract, BigNumber} = require('ethers');
const provider = new providers.JsonRpcProvider(RPC_URL)

const getContractABI = async(contractUrl: string) => {
    const url = contractUrl
    const response = await axios({
      url: url,
      method: "get",
    });
    let _contractABI = JSON.parse(response.data.result);
    return _contractABI;
}

const funding = async(masterWallet: String, unitPrice: number, subWalletList: Array<WalletProp>) => {
     const userAccount = await User.scan({wallet: masterWallet}).exec(); 
     const masterWalletPrivateKey: String = userAccount[0].privateKey;
     const privateKey = masterWalletPrivateKey;
     const wallet = new ethers.Wallet(privateKey, provider);
     const balance = await getBalanceFromWallet(masterWallet);
     const fundingValue = unitPrice * subWalletList.length;
     const remainCoin = balance.sub(ethers.utils.parseEther(fundingValue.toString()));
     const gasLimit = await getGasPrice(masterWallet, subWalletList[0].wallet);
     if(remainCoin.lt(gasLimit)) return false;
     for(let i = 0; i < subWalletList.length; i++)
     {
        const receiverAddress = subWalletList[i].wallet;
        const tx = {
            to: receiverAddress,
            value: ethers.utils.parseEther(unitPrice.toString())
        }
        await wallet.sendTransaction(tx);
     }
     return true; 
}

const defunding = async(masterWallet: String, subWalletList: Array<WalletProp>) => {
    await Promise.all(subWalletList.map(async (subWallet:any) => {
        try {
            if(subWallet.wallet === '') {
                return;
            }
            const subWalletAccout = await Wallets.scan({wallet: subWallet.wallet}).exec();
            const privateKey: String = subWalletAccout[0].privateKey;
            const wallet = new ethers.Wallet(privateKey, provider);
            const wallets = await Wallets.scan({id: subWallet.id}).exec();
            const contractAddressList = wallets[0].contracts;
            let balance = await getBalanceFromWallet(subWallet.wallet);
            let gasLimit = await getGasPrice(subWallet.wallet, masterWallet);
            if(balance.lt(gasLimit)) {
                return;
            }
            await Promise.all(contractAddressList.map(async (contractAddress:any) => {
                const contract = new Contract(contractAddress, NFT_ABI, wallet);
                const nftCount = (await contract.balanceOf(subWallet.wallet)).toNumber();
                if(nftCount > 0)
                    for(let i = nftCount - 1 ; i >= 0 ; i--)
                    {
                        const tokenId = await contract.tokenOfOwnerByIndex(subWallet.wallet, i);
                        const nft_tx = await contract.transferFrom(subWallet.wallet, masterWallet, tokenId.toString());
                        await nft_tx.wait();
                    }
            }))

            balance = await getBalanceFromWallet(subWallet.wallet);
            gasLimit = await getGasPrice(subWallet.wallet, masterWallet);
            if(balance.lt(gasLimit)) {
                return;
            }

            const receiverAddress = masterWallet;
            let tx:any = {
                to: receiverAddress,
                value: BigNumber.from(1), 
                gasLimit
            }

            const gasPrice = await provider.getGasPrice();
            const estimateGas = await provider.estimateGas(tx);
            const estimateTxFee = gasPrice.mul(estimateGas);
            tx = {
                ...tx,
                value:balance.sub(estimateTxFee.mul(BigNumber.from(2))),
                gasPrice: gasPrice
            }
            try{
                await wallet.sendTransaction(tx);
            }
            catch(err){
            }
        } catch(err) {
        }
    }))
}

const minting = async(selectedFunction: any, inputParams: Array<any>, subWalletIdList: Array<String>, contractAddress: String) => {
    const url = ContractURL + contractAddress;
    const contractABI = await getContractABI(url);
    let params = [];
    for(let i = 0; i < inputParams.length; i++)
    {
        params.push(inputParams[i].value);
    }
    try{
        let result = [];
        await Promise.all(subWalletIdList.map(async (subWalletId) => {
            const subWallets = await Wallets.scan({id: subWalletId}).exec();
            const privateKey = subWallets[0].privateKey;
            const signer = new ethers.Wallet(privateKey, provider);
            const contract = new Contract(contractAddress, contractABI, signer);
            let tx;
            try{
                const gasEstimated = await contract.estimateGas[selectedFunction.name](...params);
                tx = await contract[selectedFunction.name](...params, {gasLimit: gasEstimated});
                await tx.wait();
                result.push({"tx": tx, "mintRes": true});
            }
            catch(e){
                result.push({"tx": tx, "mintRes": false});
                return false;
            }
        }))
        return result;
    }
    catch(e){
    }
}

const getBalanceFromWallet = async(address: String) => {
    const provider = new providers.JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(address);
    return balance;
}

const getGasPrice = async( addressSender: String, addressReceiver: String ) => {
    const gasLimit = await new providers.JsonRpcProvider(RPC_URL).estimateGas({
        to: addressReceiver,
        value: await new providers.JsonRpcProvider(RPC_URL).getBalance(addressSender)
    })
    return gasLimit;
}

export default {
    funding,
    defunding,
    minting,
    getGasPrice
}

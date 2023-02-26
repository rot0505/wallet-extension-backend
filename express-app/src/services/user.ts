import User from '../models/user';
import md5 from 'md5';
const uuid = require('uuid')
const ethers = require('ethers');

const checkLogin = async(email: String, password: String) => {
    let result = await User.scan({"email":email, "password": md5(password)}).exec();
    return result;
}
const findByEmail = async (email: String) => {
    let result = await User.scan({ "email": email }).exec();
    return result;
}

const signUp = async(email: String, password: String) => {

    const newWallet = await ethers.Wallet.createRandom();
    const user = {
        email: email,
        password: md5(password),
        wallet: newWallet.address,
        privateKey: newWallet.privateKey
    }

    const result = await User.create({ id: uuid.v1(), ...user });
    return result;
}

export default {
    checkLogin,
    findByEmail,
    signUp
}
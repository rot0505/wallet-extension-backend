import { Request, Response } from 'express';
import { jwtConfig } from "../config";
import userService from '../services/user';
import jwt from 'jsonwebtoken';

import { BACKEND_ERROR, WALLET_EXIST_ERROR ,USER_NOT_EXIST, JWT_EXPIREED_ERROR } from '../constant'

const signIn = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body; 
        const usr = await userService.checkLogin(email, password);
        if(usr?.count != 0)
        {
            const accessToken = jwt.sign({ ...usr[0]}, jwtConfig.secret, { expiresIn: jwtConfig.expireTime });
            const refreshToken = jwt.sign({ ...usr[0] }, jwtConfig.refreshTokenSecret, {
                expiresIn: jwtConfig.refreshTokenExpireTime
            })

            const userData = { ...usr[0] }
            delete userData.password;
            delete userData.privateKey;

            const response = {
                userData,
                accessToken,
                refreshToken
            }

            return res.json({ success: true, message: 'Success', data: response });
        }
        else
        {
            return res.status(500).json(USER_NOT_EXIST);
        }

    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

const signUp = async(req: Request, res: Response) => {
    try{
        let {email, password} = req.body;
        const usr = await userService.findByEmail(email);
        
        if(usr.count == 0)
        {
            let result: any = userService.signUp(email, password);
            return res.json({ success: true, message: 'Success', data: result });
        }
        else
        {
            return res.status(500).json(WALLET_EXIST_ERROR);
        }
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}
 
const checkJwt = async(req: Request, res: Response) => {
    try{
        const {token} = req.body;
        let jwt_res: any
        try{
            jwt_res = jwt.verify(token, jwtConfig.secret)
        }
        catch(e){
            return res.json({success: false, message: JWT_EXPIREED_ERROR, data: null})                
        }
        const usr = await userService.findByEmail(jwt_res.email);
        const userData = {...jwt_res};
        delete userData.password;
        delete userData.privateKey;

        if(usr.count == 0)
        {
            return res.json({ success: true, message: 'Faild', data: null });
        }
        else{
            return res.json({ success: true, message: 'Success', data: userData });
        }
    }catch(e){
        return res.status(500).json(BACKEND_ERROR);
    }
}

export default{
    signIn,
    signUp,
    checkJwt
}


export interface WalletProp{
    id: string,
    wallet: string,
    privateKey: string,
    nickName: string,
    masterWallet: string,
    contracts:Array<string>
}

export interface SubWalletProp{
    walletId: string,
    walletAddress: string
}

export interface Group{
    id: string,
    groupName: string,
    wallet: string,
    subWallets: Array<SubWalletProp>
}
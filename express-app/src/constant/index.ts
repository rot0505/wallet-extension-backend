export const BAD_REQUEST = { success: false, message: 'Bad Request', data: null };
export const USER_NOT_EXIST = { success: false, message: 'Invalid email or password', data: null};
export const WALLET_EXIST_ERROR = { success: false, message: 'The wallet account already exist by this email', data: null };
export const BACKEND_ERROR = { success: false, message: 'Backend Server Error!', data: null };
export const JWT_EXPIREED_ERROR = {  success: false, message: 'jwt token expired', data: null };
export const GASLIMIT_ERROR = { success: false, message: 'Amount is too low', data: null };
export const MORALIS_API_KEY = 'JMtY5M0EeE7fxaquQ7rr1BmjV2fmM3LumZyc4pSveOkYenZN3BVjZicjEQg5LwD3';

export const ETH_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur';
export const BNB_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd,eur';
//--------------------------Mainnet
export const RPC_URL = 'https://goerli.infura.io/v3/f629b791925b4e98a8048281f9c03e44';
export const ContractURL = 'https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=';
//--------------------------Devnet
//export const RPC_URL = 'https://mainnet.infura.io/v3/f629b791925b4e98a8048281f9c03e44'
//export const ContractURL = 'https://api.etherscan.io/api?module=contract&action=getabi&address=';
export const GROUPS = ['Default', 'Group1', 'Group2', 'Group3', 'Group4'];
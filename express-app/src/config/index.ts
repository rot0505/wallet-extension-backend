import dotenv from 'dotenv'
dotenv.config()

// export const PORT = process.env.PORT
export const jwtConfig = {
    secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
    refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
    expireTime: '1000m',
    refreshTokenExpireTime: '1000m'
}

export const chains = [
    {
        name: "Ethereum",
        symbol: "ETH",
        alias: 'eth',
        chainId: 1,
        rpcUrl: "https://goerli.infura.io/v3/f629b791925b4e98a8048281f9c03e44"
    },
    // {
    //     name: "Goerli",
    //     symbol: "Goerli ETH",
    //     alias: 'goerli',
    //     chainId: 5,
    //     rpcUrl: "https://goerli.infura.io/v3/23f0aa58afdd400f9cd949a7603e3c06"
    // },
    {
        name: "Binance",
        symbol: "BNB",
        alias: "bsc",
        chainId: 56,
        rpcUrl: "https://bsc-dataseed.binance.org/"
    },
    {
        name: "Avalanche",
        symbol: "AVAX",
        alias: 'avalanche',
        chainId: 43114,
        rpcUrl: "https://api.avax.network/ext/bc/C/rpc"
    },
    {
        name: "Fantom",
        symbol: "FTM",
        alias: 'fantom',
        chainId: 250,
        rpcUrl: "https://rpcapi.fantom.network/f629b791925b4e98a8048281f9c03e44"
    }
]
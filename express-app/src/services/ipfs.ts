import axios from 'axios'
import FormData from 'form-data'

const { ipfsFileApiUrl, ipfsGateUrl, pinataApiKey, pinataSecretKey } = require('../config')

const pinFileToIPFS = async (file: ArrayBuffer | SharedArrayBuffer) => {
    try {
        let data: any = new FormData()
        data.append('file', Buffer.from(file), 'newNft.png')
        const res = await axios.post(ipfsFileApiUrl,
            data,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretKey
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        )
        return `${ipfsGateUrl}/${res.data.IpfsHash}`
    }
    catch (error) {
        return null
    }
}

module.exports = {
    pinFileToIPFS
}
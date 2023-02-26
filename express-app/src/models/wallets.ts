import dynamoose from 'dynamoose';

const WalletsSchema = new dynamoose.Schema({
  "wallet": String,
  "privateKey": String,
  "nickName": String,
  "masterWallet": String,
  "contracts": {
     "type": Array,
     "schema": [{
      "type": String
   }],
  },
  "id": {
    type: String,
    "hashKey": true
  },

}, { timestamps: true });

const Wallets = dynamoose.model('Wallets', WalletsSchema);

export default Wallets;


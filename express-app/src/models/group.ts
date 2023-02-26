import dynamoose from 'dynamoose';

const GroupSchema = new dynamoose.Schema({
  "groupName": String,
  "wallet": String,  //master wallet
  "subWallets": {
    "type": Array,
    "schema": [{
        "type": Object,
        "schema": 
        {
           "walletId": {
              "type": String
           },
           "walletAddress": {
              "type": String
           }
        }
     }],
    "default": []
  },
  "id": {
    type: String,
    "hashKey": true
  }
}, { timestamps: true });

const Group = dynamoose.model('Group', GroupSchema);

export default Group;

import dynamoose from 'dynamoose';

const UserSchema = new dynamoose.Schema({
  "email": String,
  "wallet": String,
  "privateKey": String,
  "password": String,
  "id": {
    type: String,
    "hashKey": true
  }
}, { timestamps: true });

const User = dynamoose.model('User', UserSchema);

export default User

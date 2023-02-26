import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import cors from 'cors';
import fileUpload from 'express-fileupload';

import routes from './routes';
import dynamoose from 'dynamoose';


Promise = require('bluebird');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(`${__dirname}/build`));

app.use('/api', routes);

(async () => {
  try {
    dynamoose.aws.sdk.config.update({
      "accessKeyId": process.env.ACCESS_KEY_ID,
      "secretAccessKey": process.env.SECREST_ACESS_KEY,
      "region": process.env.REGION
    });
  }
  catch (error) {
    
  }
})()

app.use('/*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.info(`Backend is  started on port ${port}`) // eslint-disable-line no-console
})


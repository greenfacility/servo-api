const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3030;

const userRoute = require('./routes/user.routes');
const authRoute = require('./routes/auth.routes');
const usersRoute = require('./routes/users.routes');
const serviceRoute = require('./routes/service.routes');
const requestRoute = require('./routes/request.routes');
const requestOutRoute = require('./routes/requestout.routes');
const propertyRoute = require('./routes/property.routes');
const locationRoute = require('./routes/location.routes');

//MongoDB Options
const db = require('./config/keys').MongoURI;
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

//Middle Wares
/** For Cross Origin Resource Sharing (CORS)*/
app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept',
//   );
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, DELETE, POST');
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(bodyParser.json());

//Connect to Database
mongoose
  .connect(db, option)
  .then(() => console.log('MongoDb Connected...'))
  .catch((err) => console.log(err));

//Connect to routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/service', serviceRoute);
app.use('/api/request', requestRoute);
app.use('/api/requestout', requestOutRoute);
app.use('/api/property', propertyRoute);
app.use('/api/location', locationRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('*', (req, res) => {
  res
    .status(404)
    .json({ status: false, message: 'Sorry, Api Does Not Exist!!!' });
});

app.listen(port, () =>
  console.log(`The server is running at http://localhost:${port}`),
);

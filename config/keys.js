const MongoURI = process.env.MONGO_URI || 'mongodb://localhost/green-test';

module.exports = {
  //   MongoURI:
  //     'mongodb+srv://eliteaddy:adeshile@cluster0-ufp8b.mongodb.net/green-test?retryWrites=true',
  MongoURI,
  // MongoURI:
  // 	'mongodb+srv://greenfacility:Greenfacility@1@cluster0-chydu.mongodb.net/sostein?retryWrites=true&w=majority',
  jwtSecret: 'anythingIsSecret',
};

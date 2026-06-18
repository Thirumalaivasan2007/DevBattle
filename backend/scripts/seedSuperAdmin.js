const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin@ac-pxbw4dp-shard-00-00.pl7ndq0.mongodb.net/test?retryWrites=true&w=majority')
  .then(async () => {
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    const res = await collection.updateOne({}, { $set: { role: 'SUPER_ADMIN' } });
    console.log('Update result:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

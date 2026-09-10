require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  const programs = await db.collection('programs').countDocuments();
  console.log('Programs count:', programs);
  process.exit(0);
}
test();

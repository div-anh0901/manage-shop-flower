const mongoose = require('mongoose');


function connectDB() {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));


    // Enable debug mode with colors
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}


module.exports = connectDB;
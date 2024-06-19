// models/imageDetails.js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  image: String,
});

mongoose.model('ImageDetails', ImageSchema);

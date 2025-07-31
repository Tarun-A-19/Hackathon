const mongoose = require('mongoose');

const WasteItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  disposalTips: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('WasteItem', WasteItemSchema);
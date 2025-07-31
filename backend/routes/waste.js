const express = require('express');
const router = express.Router();
const WasteItem = require('../models/WasteItem');

router.get('/', async (req, res) => {
  try {
    const items = await WasteItem.find();
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');

router.get('/', async (req, res) => {
  const claims = await Claim.find().sort({ createdAt: -1 }).limit(50);
  res.json({ ok: true, claims });
});

router.post('/', async (req, res) => {
  const { text, sources = [] } = req.body;
  const claim = await Claim.create({ text, sources });
  res.json({ ok: true, claim });
});

module.exports = router;

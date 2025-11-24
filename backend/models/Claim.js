const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  text: { type: String, required: true, index: true },
  status: { type: String, enum: ['unverified','true','false','mixture'], default: 'unverified' },
  confidence: { type: Number, default: 0 },
  sources: [{ type: String }],
  firstDetectedAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);

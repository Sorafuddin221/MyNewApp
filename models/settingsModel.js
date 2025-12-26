import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
  },
  siteLogoUrl: {
    type: String,
  },
  siteFaviconUrl: {
    type: String,
  },
  textIcon: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

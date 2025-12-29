import mongoose from 'mongoose';

const offerCardSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonUrl: {
    type: String,
  },
  displayLocation: {
    type: String,
    enum: ['none', 'homepage_after_top_products', 'products_page_after_pagination'],
    default: 'none',
  },
});

export default mongoose.models.OfferCard || mongoose.model('OfferCard', offerCardSchema);

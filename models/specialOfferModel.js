import mongoose from 'mongoose';

const specialOfferSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  buttonUrl: {
    type: String,
  },
});

export default mongoose.models.SpecialOffer || mongoose.model('SpecialOffer', specialOfferSchema);

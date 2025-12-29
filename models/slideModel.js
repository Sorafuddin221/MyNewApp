import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  buttonUrl: {
    type: String,
  },
});

export default mongoose.models.Slide || mongoose.model('Slide', slideSchema);

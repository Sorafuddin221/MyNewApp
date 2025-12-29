import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    default: 0,
  },
  insideDhakaShippingCost: {
    type: Number,
    default: 0,
  },
  outsideDhakaShippingCost: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.PaymentSettings || mongoose.model('PaymentSettings', paymentSettingsSchema);

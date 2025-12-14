import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter category name'],
        unique: true,
    },
    image: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
}, { timestamps: true });


let Category;

try {
    Category = mongoose.model("Category");
} catch (error) {
    Category = mongoose.model("Category", categorySchema);
}

export default Category;

import mongoose, { Types } from "mongoose";

const productSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"please enter product Description"],

},
description: {
    type: String,
    required: [true, "Please enter product description"],
},
price:{
    type:Number,
    required:[true,"please enter product price"],
    max:[99999,"price connot exceed 5 digits"]
},
offeredPrice: {
    type: Number,
},
ratings:{
    type:Number,
    default:0
},
image:[
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
        category:{
            type:mongoose.Schema.ObjectId,
            ref:"Category",
            required:[true,"please enter product category"]
        },
        tags:{
            type:String,
            
        },
        stock:{
            type:Number,
            required:[true,"please enter product stock"],
            max:[9999,"Stock Amount connot exceed 4 digits"],
            default:1
        },
        numOfReviews:{
            type:Number,
            default:0
        },
        reviews:[
            { user:{
                type:mongoose.Schema.ObjectId,
                ret:"user",
                require:true
            },
                name:{
                    type:String,
                    required:true
                },
                rating:{
                    type:Number,
                    required:true
                },
                comment:{
                    type:String,
                    required:true
                }
            }
        ],
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
})

let Product;

try {
    Product = mongoose.model("Product");
} catch (error) {
    Product = mongoose.model("Product", productSchema);
}

export default Product;
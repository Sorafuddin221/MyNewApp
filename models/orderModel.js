import mongoose, { Types } from "mongoose";
const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        Country:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        }

    },
    orderItems:[
        {
            name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        color:{
            type:String,
        },
        Image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'Product',
            required:true
        }
        }
    ],
    orderStatus:{
        type:String,
        required:true,
        default:'processing'
    },
    user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        paymentInfo:{
            id:{
                type:String,
            },
            status:{
                type:String,
            },
            val_id: {
                type: String 
            }
        },
        paidAt:{
            type:Date
        },
        itemPrice:{
            type:Number,
            required:true,
            default:0
        },
        taxPrice:{
            type:Number,
            required:true,
            default:0
        },
        shippingPrice:{
            type:Number,
            required:true,
            default:0
        },
        totalPrice:{
            type:Number,
            required:true,
            default:0
        },
        deliveredAt:Date,
        createdAt:{
            type:Date,
            default:Date.now
        }
})


let Order;

try {
    Order = mongoose.model("Order");
} catch (error) {
    Order = mongoose.model("Order", orderSchema);
}

export default Order;
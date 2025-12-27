import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


//itme add card

export const addItemsToCart=createAsyncThunk('cart/addItemsToCart',async({id,quantity,color},{rejectWithValue})=>{
try{
    const {data}=await axios.get(`/api/product/${id}`);
    if (!data.product) {
        return rejectWithValue('Product data not received from API');
    }

    const priceToUse = data.product.offeredPrice || data.product.price;
    const imageToUse = data.product.image && data.product.image.length > 0 ? data.product.image[0].url : '/images/blog-placeholder.png';

    const cartItem = {
        product:data.product._id,
        name:data.product.name,
        price: priceToUse,
        image: imageToUse,
        stock:data.product.stock,
        quantity,
        color
    };
    return cartItem;

}catch(error){
return rejectWithValue(error.response?.data || 'An Error Occured')
}
})

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:typeof window !== 'undefined' && localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        loading:false,
        error:null,
        success:false,
        message:null,
        removingId:null,
        shippingInfo:typeof window !== 'undefined' && localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
        removeMessage:(state)=>{
        state.success=null
        },
        removeItemFromCart:(state,action)=>{
            state.removingId=action.payload;
            state.cartItems=state.cartItems.filter(item=>item.product!=action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            }
            state.removingId=null
        },
        saveShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload
            if (typeof window !== 'undefined') {
                localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
            }
        },
        clearCart:(state)=>{
            state.cartItems=[];
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cartItems')
                localStorage.removeItem('shippingInfo')
            }
        }
    },
    
    //add items to cart
    extraReducers:(builder)=>{
        builder
        .addCase(addItemsToCart.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(addItemsToCart.fulfilled,(state,action)=>{
            const item=action.payload
            
            // Find an existing item that matches both product ID and color
            const existingItem = state.cartItems.find(
                (i) => i.product === item.product && i.color === item.color
            );

            if(existingItem){
                existingItem.quantity += item.quantity
                state.message=`Updated ${item.name} (${item.color}) quantity in the cart`
            }else{
                state.cartItems.push(item);
                state.message=`${item.name} (${item.color || 'No Color'}) is added to cart successfully`
            }
            state.loading=false,
            state.error=null,
            state.success=true
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            }
            

        })
        .addCase(addItemsToCart.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'An error'

        })
    }
})

export const{removeErrors,removeMessage,removeItemFromCart,saveShippingInfo,clearCart}=cartSlice.actions;
export default cartSlice.reducer;
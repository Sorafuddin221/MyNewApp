import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { updateOrderStatus } from "../admin/adminSlice";
import axios from "axios";


//creating order
export const createOrder=createAsyncThunk('order/createOrder',async(order,{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('/api/new/order',order,config)
        console.log('order Data',data);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || 'Order Creating Failed')
    }
})

//Get User Orders
export const getAllMyOrders=createAsyncThunk('order/getAllMyOrders',async(_,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/orders/user')
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || 'Order Creating Failed')
    }
})
//Get Order details
export const getOrderDetails=createAsyncThunk('order/getOrderDetails',async(orderID,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/order/${orderID}`)
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to fetch order details')
    }
})
//Delete my order
export const deleteMyOrder=createAsyncThunk('order/deleteMyOrder',async(orderID,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/order/${orderID}`)
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to delete order')
    }
})
const orderSlice=createSlice({
    name:'order',
    initialState:{
        success:false,
        loading:false,
        error:null,
        orders:[],
        order:{},
        isDeleted:false
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.success=null
        },
        removeIsDeleted:(state)=>{
            state.isDeleted=false
        }
    },
    extraReducers:(builder)=>[
        builder
        .addCase(createOrder.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(createOrder.fulfilled,(state,action)=>{
            state.loading=false,
            state.order=action.payload.order
            state.success=action.payload.success

        })
        .addCase(createOrder.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Order creating failed'
        }),
        //Get all user Order
         builder
        .addCase(getAllMyOrders.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(getAllMyOrders.fulfilled,(state,action)=>{
            state.loading=false,
            state.orders=action.payload.orders
            state.success=action.payload.success

        })
        .addCase(getAllMyOrders.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Failed ot fetch orders'
        }),
         //Get Order details
         builder
        .addCase(getOrderDetails.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(getOrderDetails.fulfilled,(state,action)=>{
            state.loading=false,
            state.order=action.payload.order
            state.success=action.payload.success

        })
        .addCase(getOrderDetails.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Failed ot fetch order details'
        }),
        //Delete Order
        builder
        .addCase(deleteMyOrder.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(deleteMyOrder.fulfilled,(state,action)=>{
            state.loading=false,
            state.isDeleted=action.payload.success

        })
        .addCase(deleteMyOrder.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Failed to delete order'
        }),
        // Handle update order status from admin slice
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            // Find the order in the orders array and update its status
            const index = state.orders.findIndex(order => order._id === action.payload.order._id);
            if (index !== -1) {
                state.orders[index] = { ...state.orders[index], ...action.payload.order };
            }
        })
    ]
})

export const {removeErrors,removeSuccess,removeIsDeleted}=orderSlice.actions;
export default orderSlice.reducer;
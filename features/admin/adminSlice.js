import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


//fetch all products
export const fetchAdminProducts = createAsyncThunk('admin/fetchAdminProducts', async (_, { rejectWithValue }) => {
    try {

        const { data } = await axios.get('/api/admin/products')
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error While Fetching the products')
    }
})
//Create products
export const createProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/admin/product/create', productData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Product Creation Failed')
    }
})

//Update products
export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/admin/product/${id}`, formData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Product Update Failed')
    }
})
//Delete products
export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (productId, { rejectWithValue }) => {
    try {

        await axios.delete(`/api/admin/product/${productId}`);
        return { productId, status: 200 };

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { productId, status: 404 }; // Treat 404 as success for UI state update
        }
        return rejectWithValue(error.response?.data || 'Product Deletion Failed')
    }
})

//|Featch All Users
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
       

        const { data } = await axios.get(`/api/admin/users`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users')
    }
})

//|get single user
export const getSingleUser = createAsyncThunk('admin/getSingleUser', async (id, { rejectWithValue }) => {
    try {
       

        const { data } = await axios.get(`/api/admin/user/${id}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch Single user')
    }
})

//|update user role
export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({userId,role}, { rejectWithValue }) => {
    try {
       

        const { data } = await axios.put(`/api/admin/user/${userId}`,{role})
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update user role')
    }
})

//|Delete  user Profile
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
       

        const { data } = await axios.delete(`/api/admin/user/${userId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Delete user')
    }
})

//|Fetch All Orders
export const fetchAllOrders = createAsyncThunk('admin/fetchAllOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/admin/orders`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Delete user')
    }
})

//|Delete order
export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        console.log("Deleting order with ID:", id);
        const { data } = await axios.delete(`/api/admin/order/${id}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Delete Order')
    }
})

//|update order status
export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({orderId,status}, { rejectWithValue }) => {
    try {
         const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/admin/order/${orderId}`,{status},config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Update Order status')
    }
})

//|Fetch All Reviews
export const fetchProductReviews = createAsyncThunk('admin/fetchProductReviews', async (productId, { rejectWithValue }) => {
    try {
         
        const { data } = await axios.get(`/api/admin/reviews?id=${productId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch Product Reviews')
    }
})

//|delete review
export const deleteReview = createAsyncThunk('admin/deleteReview', async ({productId,reviewId}, { rejectWithValue }) => {
    try {
         
        const { data } = await axios.delete(`/api/admin/reviews?productId=${productId}&id=${reviewId}`)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete Product Reviews')
    }
})
 //|Get Admin Order details
            export const getAdminOrderDetails=createAsyncThunk('admin/getAdminOrderDetails',async(orderID,{rejectWithValue})=>{
                try{
                    const {data}=await axios.get(`/api/admin/order/${orderID}`)
                    return data;
                }catch(error){
                    return rejectWithValue(error.response?.data || 'Failed to fetch admin order details')
                }
            })

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        success: false,
        loading: false,
        error: null,
        product: {},
        deleting: {},
        users:[],
        user:{},
        message:null,
        orders:[],
        totalAmount:0,
        order:{},
        reviews:[]

    },
    reducers: {
    setUser: (state, action) => {
        state.user = action.payload;
    },
    removeErrors: (state) => {
        state.error = null
    },
    removeSuccess: (state) => {
        state.success = false
    },
    clearMessage:(state)=>{
        state.message=null
    }
},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false,
                    state.products = action.payload.products
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Error while Fetching to products'
            })
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.products.push(action.payload.product)
                console.log(state.products);

            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Product Creation Failed'
            })
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.product = action.payload.product

            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Product Update Failed'
            })

        builder
            .addCase(deleteProduct.pending, (state,action) => {
                const productId=action.meta.arg;
                state.deleting[productId]=true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const productId=action.payload.productId
                state.deleting[productId]=false;
                    state.products = state.products.filter(product => product._id !== productId)

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                const productId=action.meta.arg;
                state.deleting[productId]=false;
                    state.error = action.payload?.message || 'Product Deletion Failed'
            })
            builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.users = action.payload.users

            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch users'
            })
            builder
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.user = action.payload.user

            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch single user'
            })

            builder
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false,
                    
                state.success = action.payload.success

            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to update user role'
            })
             builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                    state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                    
                state.message = action.payload.message

            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to Delete user'
            })

             builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                    state.error = null
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                    
                state.orders = action.payload.orders
                state.totalAmount = action.payload.totalAmount

            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to Fetch Orders'
            })

            builder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.message = action.payload.message

            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to Delete Order'
            })

           

            builder
            .addCase(getAdminOrderDetails.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
                state.loading = false,
                state.order = action.payload.order
            })
            .addCase(getAdminOrderDetails.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload?.message || 'Failed to fetch admin order details'
            })

            builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                state.order = action.payload.order

            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to Update Order status'
            })

            builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false,
                    state.reviews = action.payload.reviews
                
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to fetch Product Reviews'
            })

            builder
            .addCase(deleteReview.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false,
                    state.success = action.payload.success
                    state.message = action.payload.message
                
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Failed to delete Product Reviews'
            })

    }
})
export const { removeErrors, removeSuccess,clearMessage, setUser } = adminSlice.actions
export default adminSlice.reducer
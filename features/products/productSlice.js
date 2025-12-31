import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from '@/utils/api';




export const getProduct=createAsyncThunk('product/getProduct',async({keyword,page=1,category},{rejectWithValue})=>{
    try{
        let link='/api/products?page='+page;
        if(category){
            link+=`&category=${category}`;
        }
        if(keyword){
            link+=`&keyword=${keyword}`;
        }
        // const link=keyword?`/api/v1/products?keyword=${encodeURIComponent(keyword)}& page-${page}`:`/api/v1/products?page=${page}`;
        
        const {data}=await api.get(link)
        console.log('Response',data);
        return data;

    }catch(error){
        return rejectWithValue(error.response?.data || 'An error occurred')
    }
})

export const getTrending=createAsyncThunk('product/getTrending',async(_,{rejectWithValue})=>{
    try{
        const {data}=await api.get('/api/products/trending')
        return data;

    }catch(error){
        return rejectWithValue(error.response?.data || 'An error occurred')
    }
})

//product details

export const getProductDetails=createAsyncThunk('product/getProductDetails',async(id,{rejectWithValue})=>{
    try{
        const link=`/api/product/${id}`;
        const {data}=await api.get(link);
        
        return data;

    }catch(error){
        return rejectWithValue(error.response?.data || 'An error occurred')
    }
})

//Submit review
export const createReview=createAsyncThunk('product/createReview',async(reviewData,{rejectWithValue})=>{
    try{
        const config={
            headers:{
            'Content-Type':'application/json'
            }
        }
     
        const {data}=await api.put('/api/review',reviewData,config);
        return data;

    }catch(error){
        return rejectWithValue(error.response?.data || 'An error occurred')
    }
})

// Ask Question
export const askQuestion = createAsyncThunk('product/askQuestion', async (questionData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await api.post('/api/product/query', questionData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

// Answer Question
export const answerQuestion = createAsyncThunk('product/answerQuestion', async (answerData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await api.put('/api/admin/query', answerData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

const productSlice=createSlice({
name:'product',
initialState:{
    products:[],
    productCount:0,
    loading:false,
    error:null,
    product:null,
    resultsPerpage:4,
    totalPages:0,
    reviewSuccess:false,
    reviewLoading:false,
    querySuccess: false,
    queryLoading: false

},
reducers:{
    setProduct: (state, action) => {
        state.product = action.payload;
    },
    removeErrors:(state)=>{
        state.error=null
    },
     removeSuccess:(state)=>{
        state.reviewSuccess=false
    },
    removeQuerySuccess: (state) => {
        state.querySuccess = false
    }
},
extraReducers:(builder)=>{
builder.addCase(getProduct.pending,(state)=>{
    state.loading=true;
    state.error=null
})
.addCase(getProduct.fulfilled,(state,action)=>{
    console.log('Fulfilled action payload',action.payload);
    state.loading=false;
    state.error=null;
    state.products=action.payload.products;
    state.productCount=action.payload.productCount;
    state.resultsPerpage=action.payload.resultsPerpage;
    state.totalPages=action.payload.totalPages;


})
.addCase(getProduct.rejected,(state,action)=>{
    state.loading=false;
    state.error=action.payload || 'something went wrong';
    state.products=[]
})
.addCase(getTrending.pending,(state)=>{
    state.loading=true;
    state.error=null
})
.addCase(getTrending.fulfilled,(state,action)=>{
    state.loading=false;
    state.error=null;
    state.products=action.payload.products;
})
.addCase(getTrending.rejected,(state,action)=>{
    state.loading=false;
    state.error=action.payload || 'something went wrong';
    state.products=[]
})
builder.addCase(getProductDetails.pending,(state)=>{
    state.loading=true;
    state.error=null
})
.addCase(getProductDetails.fulfilled,(state,action)=>{
    console.log('Product Details',action.payload);
    state.loading=false;
    state.error=null;
    state.product=action.payload.product;
    

})
.addCase(getProductDetails.rejected,(state,action)=>{
    state.loading=false;
    state.error=action.payload || 'something went wrong'
})

builder.addCase(createReview.pending,(state)=>{
    state.reviewLoading=true;
    state.error=null
})
.addCase(createReview.fulfilled,(state,action)=>{
    state.reviewLoading=false;
    state.reviewSuccess=true;
    

})
.addCase(createReview.rejected,(state,action)=>{
    state.reviewLoading=false;
    state.error=action.payload || 'something went wrong'
})
.addCase(askQuestion.pending, (state) => {
    state.queryLoading = true;
    state.error = null
})
.addCase(askQuestion.fulfilled, (state, action) => {
    state.queryLoading = false;
    state.querySuccess = true;
})
.addCase(askQuestion.rejected, (state, action) => {
    state.queryLoading = false;
    state.error = action.payload || 'something went wrong'
})
.addCase(answerQuestion.pending, (state) => {
    state.queryLoading = true;
    state.error = null
})
.addCase(answerQuestion.fulfilled, (state, action) => {
    state.queryLoading = false;
    state.querySuccess = true;
})
.addCase(answerQuestion.rejected, (state, action) => {
    state.queryLoading = false;
    state.error = action.payload || 'something went wrong'
})

}
})
export const {removeErrors,removeSuccess,setProduct, removeQuerySuccess}=productSlice.actions;
export default productSlice.reducer;
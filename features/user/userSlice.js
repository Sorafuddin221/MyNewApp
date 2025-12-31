import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";


//Register Api
export const register=createAsyncThunk('user/register',async(userData,{rejectWithValue})=>{
try{
const config={
    headers:{
        'content-Type':'multipart/form-data'
    }
}
const {data}=await api.post('/api/register',userData,config)
return data

}catch(error){
return rejectWithValue(error.response?.data || 'Registration failed. Please try again later')
}
})

//login Api 
export const login=createAsyncThunk('user/login',async({email,password},{rejectWithValue})=>{
try{
const config={
    headers:{
        'content-Type':'application/json'
    }
}
const {data}=await api.post('/api/login',{email,password},config)
return data

}catch(error){
return rejectWithValue(error.response?.data || 'login failed. Please try again later')
}
})
export const loadUser=createAsyncThunk('user/loadUser',async(_,{rejectWithValue})=>{
try{
    const {data}=await api.get('/api/profile');
    return data;

}catch(error){
return rejectWithValue(error.response?.data || 'faild to load user profile')
}
})

export const logout=createAsyncThunk('user/logout',async(_,{rejectWithValue})=>{
try{
    const {data}=await api.post('/api/logout',{withCredentials:true});
    return data;

}catch(error){
return rejectWithValue(error.response?.data || 'faild to load user profile')
}
})

export const updateProfile=createAsyncThunk('user/updateProfile',async(formData,{rejectWithValue})=>{
try{
    const config={
        headers:{
            'Content-Type':'multipart/form-data'
        }
    }
    const {data}=await api.put('/api/profile/update',formData,config);
    return data

}catch(error){
return rejectWithValue(error.response?.data || {message:'Profile update failed.Please try again later'})
}
})

export const updatePassword=createAsyncThunk('user/updatePassword',async(userData,{rejectWithValue})=>{
try{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const {data}=await api.put('/api/password/update',userData,config);
    return data

}catch(error){
return rejectWithValue(error.response?.data || 'Password update failed')
}
})

export const forgotPassword=createAsyncThunk('user/forgotPassword',async(userData,{rejectWithValue})=>{
try{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const {data}=await api.post('/api/password/forgot',userData,config);
    return data

}catch(error){
return rejectWithValue(error.response?.data || {message:'Email Send Failed'})
}
})

export const resetPassword=createAsyncThunk('user/resetPassword',async({token,userData},{rejectWithValue})=>{
try{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const {data}=await api.post(`/api/reset/${token}`,userData,config);
    return data

}catch(error){
return rejectWithValue(error.response?.data || {message:'Email Send Failed'})
}
})

const userSlice=createSlice({
    name:'user',
    initialState:{
        user:typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading:false,
        error:null,
        success:false,
        isAuthenticated:typeof window !== 'undefined' && localStorage.getItem('isAuthenticated')==='true',
        message:null
    },
    reducers:{
         removeErrors:(state)=>{
        state.error=null
        },
                 removeSuccess:(state)=>{
                state.success=null
                },
                        logoutSuccess:(state)=>{
                            state.user=null
                            state.isAuthenticated=false
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('user')
                                localStorage.removeItem('isAuthenticated')
                                localStorage.removeItem('token')
                            }
                        }            },
            extraReducers:(builder)=>{
                //register cases
                builder
                .addCase(register.pending,(state)=>{
                    state.loading=true,
                    state.error=null
                })
                        .addCase(register.fulfilled,(state,action)=>{
                            state.loading=false,
                            state.error=null
                            state.success=action.payload.success
                            state.user=action.payload?.user || null
                            state.isAuthenticated=Boolean(action.payload?.user)
                
                            //store in localStogage
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('user',JSON.stringify(state.user));
                                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
                                localStorage.setItem('token',action.payload.token)
                            }
                
                        })
                        .addCase(register.rejected,(state,action)=>{
                            state.loading=false,
                            state.error=action.payload?.message || 'Registration failed. Please try again later'
                            state.user=null
                            state.isAuthenticated=false
                        })
                        //login cases
                        builder
                        .addCase(login.pending,(state)=>{
                            state.loading=true,
                            state.error=null
                        })
                        .addCase(login.fulfilled,(state,action)=>{
                            state.loading=false,
                            state.error=null
                            state.success=action.payload.success
                            state.user=action.payload?.user || null
                            state.isAuthenticated=Boolean(action.payload?.user)
                
                             //store in localStogage
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('user',JSON.stringify(state.user));
                                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
                                localStorage.setItem('token',action.payload.token)
                            }
                
                
                        })
                        .addCase(login.rejected,(state,action)=>{
                            state.loading=false,
                            state.error=action.payload?.message || 'login failed. Please try again later'
                            state.user=null
                            state.isAuthenticated=false
                        })
                
                        //logout user
                        builder
                        .addCase(logout.pending,(state)=>{
                            state.loading=true,
                            state.error=null
                        })
                        .addCase(logout.fulfilled,(state,action)=>{
                            state.loading=false,
                            state.error=null
                            state.user=null
                            state.isAuthenticated=false
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('user')
                                localStorage.removeItem('isAuthenticated')
                                localStorage.removeItem('token')
                            }
                            
                
                        })
                        .addCase(logout.rejected,(state,action)=>{
                            state.loading=false,
                            state.error=action.payload?.message || 'failed to load user profile'
                        })
                         // loading cases
                        builder
                        .addCase(loadUser.pending,(state)=>{
                            state.loading=true,
                            state.error=null
                        })
                        .addCase(loadUser.fulfilled,(state,action)=>{
                            state.loading=false,
                            state.error=null
                            state.user=action.payload?.user || null
                            state.isAuthenticated=Boolean(action.payload?.user)
                
                             //store in localStogage
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('user',JSON.stringify(state.user));
                                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
                                localStorage.setItem('token',action.payload.token)
                            }
                
                
                        })
                        .addCase(loadUser.rejected,(state,action)=>{
                            state.loading=false,
                            state.error=action.payload?.message || 'login to load user profile.'
                            state.user=null
                            state.isAuthenticated=false
                
                            if(action.payload?.statusCode===401){
                                state.user=null;
                                state.isAuthenticated=false;
                                if (typeof window !== 'undefined') {
                                    localStorage.removeItem('user')
                                    localStorage.removeItem('isAuthenticated')
                                    localStorage.removeItem('token')
                                }
                            }
                        })
        
                //update user profile 
                builder
                .addCase(updateProfile.pending,(state)=>{
                    state.loading=true,
                    state.error=null
                })
                .addCase(updateProfile.fulfilled,(state,action)=>{
                    state.loading=false,
                    state.error=null
                    state.user=action.payload?.user || null
                    state.success=action.payload?.success
                    state.message=action.payload?.message  
        
                })
                .addCase(updateProfile.rejected,(state,action)=>{
                    state.loading=false,
                    state.error=action.payload?.message || 'Profile update failed. Please try again later'
                })
        
                //update user Password 
                builder
                .addCase(updatePassword.pending,(state)=>{
                    state.loading=true,
                    state.error=null
                })
                .addCase(updatePassword.fulfilled,(state,action)=>{
                    state.loading=false,
                    state.error=null
                    state.success=action.payload?.success
        
                })
                .addCase(updatePassword.rejected,(state,action)=>{
                    state.loading=false,
                    state.error=action.payload?.message || 'Password update failed. Please try again later'
                })
                //Forgot user Password 
                builder
                .addCase(forgotPassword.pending,(state)=>{
                    state.loading=true,
                    state.error=null
                })
                .addCase(forgotPassword.fulfilled,(state,action)=>{
                    state.loading=false,
                    state.error=null
                    state.success=action.payload?.success
                    state.message=action.payload?.message
        
        
                })
                .addCase(forgotPassword.rejected,(state,action)=>{
                    state.loading=false,
                    state.error=action.payload?.message || 'Email Send Failed'
                })
        
                 //reset user Password 
                builder
                .addCase(resetPassword.pending,(state)=>{
                    state.loading=true,
                    state.error=null
                })
                .addCase(resetPassword.fulfilled,(state,action)=>{
                    state.loading=false,
                    state.error=null
                    state.success=action.payload?.success
                    state.user=null,
                    state.isAuthenticated=false
        
        
                })
                .addCase(resetPassword.rejected,(state,action)=>{
                    state.loading=false,
                    state.error=action.payload?.message || 'Email Send Failed'
                })
                
            }
        
        })
        export const {removeErrors,removeSuccess,logoutSuccess}=userSlice.actions;
        export default userSlice.reducer;
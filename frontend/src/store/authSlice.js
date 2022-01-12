import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    isAuth: false,
    user:'',
    otp:{
      phone:'',
      hash:''
    } 
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth:(state,action) => {
      const { userDt }=action.payload
      state.user=userDt;
      if(state.user===null){
        state.isAuth=false;
      }else{

        state.isAuth=true;
      }
    },
    setOtp:(state,action)=>{
      const { phone,hash }= action.payload
      state.otp.phone=phone;
      state.otp.hash=hash;
    },
  },
})

export const { setAuth,setOtp } = authSlice.actions
export default authSlice.reducer


//slice comines the functionality of actions and reducers in single 
import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    name:'',
    avatar:''
}

const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {
    setName:(state,action) => {
      state.name=action.payload
    },
    setAvatar:(state,action)=>{
      state.avatar = action.payload
    },
  },
})

export const { setName,setAvatar } = activateSlice.actions
export default activateSlice.reducer


//slice comines the functionality of actions and reducers in single 
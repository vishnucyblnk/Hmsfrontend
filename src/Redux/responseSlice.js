import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    isEdited : false
}

const responseSlice = createSlice({
    name: 'response',
    initialState,
    reducers : {
        checkLog : (prevState,action)=>{
            prevState.isLoggedIn = action.payload;
            localStorage.setItem('isLoggedIn', JSON.stringify(prevState.isLoggedIn));
        },
        editResponse : (prevState,action)=>{
            prevState.isEdited = action.payload;
        }
    }
})

export const { checkLog,editResponse } = responseSlice.actions;

export default responseSlice.reducer;
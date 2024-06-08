import {configureStore} from '@reduxjs/toolkit';
import responseReducer from './responseSlice';

const store = configureStore({
    reducer: {
        response : responseReducer 
    }
});

export default store;
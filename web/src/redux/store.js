//Redux to manage the state of application 
//npm install @reduxjs/toolkit redux-persist react-redux redux
import {configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import {useDispatch as useAppDispatch, useSelector as useAppSelector} from "react-redux";
import { rootPeristConfig, rootReducer } from "./rootReducer";
//Store that contain piece of information
const store = configureStore({
    reducer: persistReducer(rootPeristConfig, rootReducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

const persistor = persistStore(store);

const {dispatch} = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export{store, persistor, dispatch, useSelector, useDispatch}
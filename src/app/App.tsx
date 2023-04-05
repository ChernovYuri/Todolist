import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from "../components/ButtonAppBar";
import Container from '@mui/material/Container';
import {useAppDispatch, useAppSelector} from "./store";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {CircularProgress, LinearProgress} from "@mui/material";
import {RequestStatusType} from "./app-reducer";
import {CustomizedSnackbars} from "../components/ErrorSnackBar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {meTC} from "../features/Login/authReducer";

function App() {
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const isInitialized = useAppSelector<boolean>((state) => state.auth.isInitialized)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(meTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className='App'>
            <CustomizedSnackbars/>
            <ButtonAppBar/>
            {status === 'loading' && <LinearProgress color={'secondary'}/>} <Container fixed>
            <Routes>
                <Route path={'/'} element={<TodolistsList/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>} />
                <Route path='*' element={<Navigate to={'404'}/>} />
            </Routes>
        </Container>
        </div>
    )
}

export default App;

import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from "../common/components/ButtonAppBar";
import Container from '@mui/material/Container';
import {useAppDispatch, useAppSelector} from "./store";
import {TodolistsList} from "features/TodolistsList/TodolistsList";
import {CircularProgress, LinearProgress} from "@mui/material";
import {meTC} from "app/appReducer";
import {CustomizedSnackbars} from "common/components/ErrorSnackBar";
import {Auth} from "features/Auth/Auth";
import {Navigate, Route, Routes} from "react-router-dom";
import {selectIsInitialized, selectStatus} from "app/app.selectors";

function App() {
    const status = useAppSelector(selectStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
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
                <Route path={'/login'} element={<Auth/>}/>
                <Route path={'/404'} element={
                    <h1>404: PAGE NOT FOUND</h1>
                } />
                <Route path='*' element={<Navigate to={'404'}/>} />
            </Routes>
        </Container>
        </div>
    )
}

export default App;

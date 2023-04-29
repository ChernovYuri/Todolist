import React, {useEffect} from 'react';
import Container from '@mui/material/Container';
import {useAppSelector} from "common/hooks/useAppSelector";
import {TodolistsList} from "features/TodolistsList/TodolistsList";
import {CircularProgress, LinearProgress} from "@mui/material";
import {CustomizedSnackbars} from "common/components/ErrorSnackBar";
import {Auth} from "features/Auth/Auth";
import {Route, Routes} from "react-router-dom";
import {selectIsInitialized, selectStatus} from "app/app.selectors";
import {authThunks} from "features/Auth/authReducer";
import {useActions} from "common/hooks/useActions";
import {ButtonAppBar} from "common/components/ButtonAppBar";

export const App = () => {
    const status = useAppSelector(selectStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
    const {initializeApp} = useActions(authThunks)

    useEffect(() => {
        initializeApp({})
    }, [])

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
            {status === 'loading' && <LinearProgress color={'secondary'}/>}

            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Auth/>}/>
                    <Route path={'/404'} element={
                        <h1>404: PAGE NOT FOUND</h1>
                    }/>
                    {/*<Route path='*' element={<Navigate to={'404'}/>}/>*/}
                    <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>
        </div>
    )
}
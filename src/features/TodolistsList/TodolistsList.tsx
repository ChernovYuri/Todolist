import {createTodoTC, getTodoTC, TodolistDomainType} from "./todolistsReducer";
import React, {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";


export const TodolistsList: React.FC = () => {


    let todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists);
    let isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
    let dispatch = useAppDispatch()

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getTodoTC())
        }
    }, [])

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(createTodoTC(newTitle))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to='/login'/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm callback={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {todolists.map((todolist) => {
                return <Grid item
                             key={todolist.id}>
                    <Paper elevation={18} style={{padding: '10px'}}>
                        <Todolist
                            todolist={todolist}
                        />
                    </Paper>
                </Grid>
            })}
        </Grid>
    </>
}
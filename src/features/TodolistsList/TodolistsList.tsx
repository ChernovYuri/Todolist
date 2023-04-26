import {todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";
import React, {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "common/components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useAppSelector} from "common/hooks/useAppSelector";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectTodolists} from "features/TodolistsList/Todolist/todolists.selectors";
import {useActions} from "common/hooks/useActions";


export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector(selectTodolists);
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const {fetchTodos, createTodo} = useActions(todolistsThunks)

    useEffect(() => {
        if (isLoggedIn) {
            fetchTodos()
        }
    }, [])

    const addTodolist = useCallback((newTitle: string) => {
       createTodo(newTitle)
    }, [])

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
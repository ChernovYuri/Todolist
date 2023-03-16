import {createTodoTC, getTodoTC, TodolistDomainType} from "./todolistsReducer";
import React, {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useAppDispatch, useAppSelector} from "../../app/store";

type TodolistsListPropsType = {
    todolists: TodolistDomainType[]
}
export const TodolistsList: React.FC = (props) => {

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

    let todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists);
    let dispatch = useAppDispatch()

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(createTodoTC(newTitle))
    }, [dispatch])

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
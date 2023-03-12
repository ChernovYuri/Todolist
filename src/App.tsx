import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import {addTodolistsAC} from "./reducers/todolistsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {TaskType, Todolist} from "./Todolist";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = { id: string, title: string, filter: FilterValuesType }

export type TasksType = {
    [key: string]: TaskType[]
}

function App() {
    let todolists = useSelector<AppRootStateType, TodolistType[]>(state=>state.todolists);

    let dispatch = useDispatch()

    const addTodolist = useCallback((newTitle: string) => {
        let action = addTodolistsAC(newTitle)
        dispatch(action)
    },[dispatch])

    return (
        <div className='App'>
            <ButtonAppBar/>
            <Container fixed>
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
            </Container>
        </div>
    )
}

export default App;

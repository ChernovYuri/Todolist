import React, {useCallback, useEffect} from 'react';
import './App.css';
import ButtonAppBar from "../components/ButtonAppBar";
import Container from '@mui/material/Container';
import {createTodoTC, getTodoTC, TodolistDomainType} from "../features/TodolistsList/todolistsReducer";
import {useAppDispatch, useAppSelector} from "./store";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";

function App() {
    return (
        <div className='App'>
            <ButtonAppBar/>
            <Container fixed>
{/*                <Grid container style={{padding: '20px'}}>
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
                </Grid>*/}
                <TodolistsList />
            </Container>
        </div>
    )
}

export default App;

import React, {useEffect, useState} from 'react';
import './App.css';
import ToDoList, {TaskType} from "./ToDoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

export type FilterValuesType = 'all' | 'active' | 'completed'
type TodolistsType = { id: string, title: string, filter: FilterValuesType }

export type TasksType = {
    [key: string]: TaskType[]
}

function App() {
    debugger
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TasksType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Eggs", isDone: false},
            {id: v1(), title: "Meat", isDone: false},
            {id: v1(), title: "Pasta", isDone: false},
        ]
    });


    // const todoListTitle: string = 'What to Learn'
    {/*const todoListTitle_2: string = 'What to buy'*/
    }
//let tasks: Array<TaskType>, setTasks: (tasks: Array<TaskType>)=> void  - это равнозначно объявлению в модели
//первые квадратные скобки после  const не массив, а модель:
//     const [tasks, setTasks] = useState<TaskType[]>(
//         [
//             {id: v1(), title: 'HTML & CSS', isDone: true},
//             {id: v1(), title: 'ES6 & TS', isDone: true},
//             {id: v1(), title: 'REACT', isDone: false},
//             {id: v1(), title: 'Redux', isDone: false},
//         ])
    const removeTodolist = (todolistID: string) => {
        setTodolists(todolists.filter(el => el.id !== todolistID))
        delete tasks[todolistID]
    }

    const [filter, setFilter] = useState<FilterValuesType>('all')
    //function
    //let tasks = result[0]
    //const setTasks = result[1]
    //let tasks: Array<TaskType>  = [ /* == ..: TaskType[] */
    //    {id: 1, title: 'HTML & CSS', isDone: true},
    //{id: 2, title: 'ES6 & TS', isDone: true},
    //    {id: 3, title: 'REACT', isDone: false},
    //]

    const changeTodoFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    const addTask = (todolistID: string, title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
        // const newTask: TaskType = {
        //     id: v1(),
        //     title: title,
        //     isDone: false
        // }
        // setTasks([...tasks, newTask])
    }

    const updateTask = (todolistID: string, taskId: string, newTitle: string) => {
        setTasks({
            ...tasks, [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
        })
    }

    const updateTodolist = (todolistId: string, newTitle: string) => {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
    }

    const changeTaskStatus = (todolistID: string, taskId: string, newIsDone: boolean) => {
        setTasks({
            ...tasks,
            [todolistID]: tasks[todolistID].map(el => el.id === taskId ? {...el, isDone: newIsDone} : el)
        })
        // const nextState = tasks.map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        // setTasks(nextState)
        // можно в 2 строки, так как переменная nextState нигде больше не use, но ухудшится читаемость
        // setTasks(tasks.map(t => t.id === taskId ? {...t, isDone: !t.isDone}: t))
        // или
        // const taskForUpdate = tasks.fing(t => t.id === taskId)
        // if (taskForUpdate) {
        //  taskForUpdate.isDone = !task.ForUpdate.isDone
        //  setTasks([...tasks])
        // }
        //
    }

    const removeTask = (todolistID: string, taskId: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(el => el.id !== taskId)})
        // setTasks(tasks.filter(t => t.id !== taskId))    // 5-10ms
        // console.log(tasks) - [{}{}{}] 3 объекта, так как не успел обновится(асинхронное обновление state)
    }
// для фикса:
    useEffect(() => {
        console.log(tasks)      //делается это
    }, [tasks])  //когда это меняется

    function changeFilter(todolistId: string, value: FilterValuesType) {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
    }

    const addTodolist = (newTitle: string) => {
        let newID = v1()
        let newTodo: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
        setTodolists([newTodo, ...todolists])
        setTasks({...tasks, [newID]: []})
    }

    return (
        <div className='App'>
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm callback={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map((el) => {
                        const getFilteredTasksForRender = () => {
                            switch (el.filter) {
                                case "active":
                                    return tasks[el.id].filter(t => t.isDone === false)
                                case "completed":
                                    return tasks[el.id].filter(t => t.isDone === true)
                                default:
                                    return tasks[el.id]
                            }
                        }
                        const filteredTasksForRender: Array<TaskType> = getFilteredTasksForRender();
                        return <Grid item>
                            <Paper elevation={18} style={{padding: '10px'}}>
                                <ToDoList
                                    key={el.id}
                                    todolistID={el.id}
                                    removeTodolist={removeTodolist}
                                    addTask={addTask}
                                    removeTask={removeTask}
                                    changeTodoFilter={changeTodoFilter}
                                    title={el.title}
                                    tasks={filteredTasksForRender}
                                    changeTaskStatus={changeTaskStatus}
                                    filter={el.filter}
                                    changeFilter={changeFilter}
                                    updateTask={updateTask}
                                    updateTodolist={updateTodolist}
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

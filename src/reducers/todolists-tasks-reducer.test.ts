import {addTodolistsAC, removeTodolistsAC, TodolistsReducer} from "./todolistsReducer";
import {TasksReducer} from "./tasksReducer";
import {v1} from "uuid";
import {TodolistType} from "../App";

test('ids should be equals', () => {
    const startTasksState = {}
    const startTodolistsState: TodolistType[] = [
        {todolistId: 'todolistID1', todolistTitle: 'What to learn', filter: 'all'},
        {todolistId: 'todolistID2', todolistTitle: 'What to buy', filter: 'all'},
    ]
    let newId = v1()
    const action = addTodolistsAC('New Todolist')

    const endTasksState = TasksReducer(startTasksState, action)
    const endTodolistsState = TodolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].todolistId

    expect(idFromTasks).toBe(action.payload.newId)
    expect(idFromTodolists).toBe(action.payload.newId)
})

test('property with todolistId should be deleted', () => {
    const startState = {
        'todolistId1': [
            {taskId: '1', taskTitle: 'CSS', isDone: false},
            {taskId: '2', taskTitle: 'JS', isDone: true},
            {taskId: '3', taskTitle: 'React', isDone: false}
        ],
        'todolistId2': [
            {taskId: '1', taskTitle: 'bread', isDone: false},
            {taskId: '2', taskTitle: 'milk', isDone: true},
            {taskId: '3', taskTitle: 'tea', isDone: false}
        ]
    }

    const action = removeTodolistsAC('todolistId2')

    const endState = TasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

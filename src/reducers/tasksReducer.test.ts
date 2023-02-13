import {
    addTaskAC,
    changeTaskStatusAC,
    removeTaskAC,
    TasksReducer,
    updateTaskAC
} from "./tasksReducer";
import {addTodolistsAC, removeTodolistsAC, TodolistsReducer} from "./todolistsReducer";
import {v1} from "uuid";
import {TasksType, TodolistsType} from "../App";

let startState: TasksType

beforeEach(()=>{
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = TasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '3', title: 'tea', isDone: false}
        ]
    })
})

test('correct task should be added to correct array', () => {

    let title = 'juce'
    let newTask = {id: 'newId', title: title, isDone: false}
    const action = addTaskAC('todolistId2', title, newTask)

    const endState = TasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].isDone).toBe(false)
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('todolistId2', '2', false)

    const endState = TasksReducer(startState, action)

    expect(endState['todolistId2'][1].isDone).toBe(false)
    expect(endState['todolistId1'][1].isDone).toBe(true)
    expect(endState['todolistId2'][0].isDone).toBe(false)
})

test('title of specified task should be changed', () => {


    const action = updateTaskAC('todolistId2', '2', 'gamarjoba')

    const endState = TasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('gamarjoba')
    expect(endState['todolistId1'][1].title).toBe('JS')
    expect(endState['todolistId2'][0].title).toBe('bread')
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistsAC('new todolist')

    const endState = TasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

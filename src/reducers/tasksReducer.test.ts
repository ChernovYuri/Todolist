import {
    addTaskAC,
    changeTaskStatusAC,
    removeTaskAC,
    TasksReducer,
    updateTaskAC
} from "./tasksReducer";
import {addTodolistsAC, removeTodolistsAC, TodolistsReducer} from "./todolistsReducer";
import {v1} from "uuid";
import {TasksType} from "../App";

let startState: TasksType

beforeEach(()=>{
    startState = {
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
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = TasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {taskId: '1', taskTitle: 'CSS', isDone: false},
            {taskId: '2', taskTitle: 'JS', isDone: true},
            {taskId: '3', taskTitle: 'React', isDone: false}
        ],
        'todolistId2': [
            {taskId: '1', taskTitle: 'bread', isDone: false},
            {taskId: '3', taskTitle: 'tea', isDone: false}
        ]
    })
})

test('correct task should be added to correct array', () => {

    let title = 'juce'
    let newTask = {taskId: 'newId', taskTitle: title, isDone: false}
    const action = addTaskAC('todolistId2', title, newTask)

    const endState = TasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].taskId).toBeDefined()
    expect(endState['todolistId2'][0].taskTitle).toBe('juice')
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

    expect(endState['todolistId2'][1].taskTitle).toBe('gamarjoba')
    expect(endState['todolistId1'][1].taskTitle).toBe('JS')
    expect(endState['todolistId2'][0].taskTitle).toBe('bread')
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

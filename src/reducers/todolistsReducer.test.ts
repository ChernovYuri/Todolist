import {
    addTodolistsAC,
    changeFilterTodolistsAC,
    removeTodolistsAC,
    TodolistsReducer,
    updateTodolistsAC
} from './todolistsReducer';
import {v1} from 'uuid';
import {FilterValuesType, TodolistType} from '../App';

let todolistId1: string
let todolistId2: string
let startState: TodolistType[]

beforeEach(()=>{
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {todolistId: todolistId1, todolistTitle: "What to learn", filter: "all"},
        {todolistId: todolistId2, todolistTitle: "What to buy", filter: "all"}
    ]
})


test('correct todolist should be removed', () => {

    const endState = TodolistsReducer(startState, removeTodolistsAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].todolistId).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";

    const endState = TodolistsReducer(startState, addTodolistsAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[0].todolistTitle).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";


    const action = {
        type: 'CHANGE-TODOLIST-TITLE',
        id: todolistId2,
        title: newTodolistTitle
    };

    const endState = TodolistsReducer(startState, updateTodolistsAC(todolistId2, newTodolistTitle));

    expect(endState[0].todolistTitle).toBe("What to learn");
    expect(endState[1].todolistTitle).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action = {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todolistId2,
        filter: newFilter
    };

    const endState = TodolistsReducer(startState, changeFilterTodolistsAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
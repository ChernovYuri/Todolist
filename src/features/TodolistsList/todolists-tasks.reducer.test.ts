import {TodolistDomainType, todolistsReducer, todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";
import {TasksDomainType, tasksReducer, TasksType} from "features/TodolistsList/tasks/tasksReducer";
import {TodolistType} from "features/TodolistsList/Todolist/todolists.api";


test('ids should be equals', () => {
	const startTasksState: TasksDomainType = {};
	const startTodolistsState: TodolistDomainType[] = [];

	let todolist: TodolistType = {
		title: 'new todolist',
		id: 'any id',
		addedDate: '',
		order: 0
	}

	const action = todolistsThunks.createTodo.fulfilled({todolist: todolist}, 'requestId', todolist.title);

	const endTasksState = tasksReducer(startTasksState, action)
	const endTodolistsState = todolistsReducer(startTodolistsState, action)

	const keys = Object.keys(endTasksState);
	const idFromTasks = keys[0];
	const idFromTodolists = endTodolistsState[0].id;

	expect(idFromTasks).toBe(action.payload.todolist.id);
	expect(idFromTodolists).toBe(action.payload.todolist.id);
});

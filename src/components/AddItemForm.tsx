import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

type PropsType = {
    callback: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = memo((props: PropsType) => {
    console.log('AddItemForm rendering')
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<boolean>(false)

    const onClickAddTaskToDoListHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.callback(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }

    const onKeyDownAddTaskToDoListHandler = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onClickAddTaskToDoListHandler()

    // const errorMessage = error && <div style={{color: 'red'}}>Field is empty</div>

    const buttonStyles = {
        maxWidth: '40px',
        maxHeight: '40px',
        minWidth: '40px',
        minHeight: '40px',
    }

    return (
        <div>
            {/*<input
                value={title}
                onChange={onChangeLocalTitleHandler}
                onKeyDown={onKeyDownAddTaskToDoListHandler}
                className={error ? 'inputError' : ''}
            />*/}
            <TextField
                size={"small"}
                id="standard-basic"
                label={error ? 'Field is empty' : 'New'}
                variant="standard"
                value={title}
                onChange={onChangeLocalTitleHandler}
                onKeyDown={onKeyDownAddTaskToDoListHandler}
                error={error}
                disabled={props.disabled}
                // className={error ? 'inputError' : ''}
            />
            {/*<button onClick={onClickAddTaskToDoListHandler}>+</button>*/}
            <Button variant="contained" style={buttonStyles}
                    onClick={onClickAddTaskToDoListHandler}
                    disabled={props.disabled}>+</Button>
        </div>
    );
})

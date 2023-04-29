import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import {RejectValueType} from "common/utils/createAppAsyncThunk";

type Props = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm = memo(({addItem, disabled}: Props) => {
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<string | null>(null)

    const createTaskTodolistHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle)
                .then(() => {
                    setTitle('')
                })
                // .catch((res: ResponseType) => {
                //     debugger
                //     setError(res.messages[0])
                // })
                .catch((err: RejectValueType)=>{
                    if (err.data) {
                        const messages = err.data.messages
                        setError(messages.length? messages[0] : 'Unknown error')
                    }
                })
        } else {
            setError('Title is required')
        }
    }

    const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setTitle(e.currentTarget.value)
    }

    const onKeyDownAddTaskToDoListHandler = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && createTaskTodolistHandler()

    // const errorMessage = error && <div style={{color: 'red'}}>Field is empty</div>

    const buttonStyles = {
        maxWidth: '35px',
        maxHeight: '35px',
        minWidth: '35px',
        minHeight: '35px',
    }

    return (
        <div>
            <TextField
                size={"small"}
                id="standard-basic"
                label='Title'
                helperText={error}
                variant="standard"
                value={title}
                onChange={onChangeLocalTitleHandler}
                onKeyDown={onKeyDownAddTaskToDoListHandler}
                error={!!error}
                disabled={disabled}
            />
            <Button variant="contained" style={buttonStyles}
                    onClick={createTaskTodolistHandler}
                    disabled={disabled}
                    size={"small"}>
                +
            </Button>
        </div>
    );
})
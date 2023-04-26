import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

type Props = {
    callback: (title: string) => void
    disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({callback, disabled}) => {
    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<boolean>(false)

    const onClickAddTaskToDoListHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            callback(trimmedTitle)
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
            <TextField
                size={"small"}
                id="standard-basic"
                label={error ? 'Field is empty' : 'New'}
                variant="standard"
                value={title}
                onChange={onChangeLocalTitleHandler}
                onKeyDown={onKeyDownAddTaskToDoListHandler}
                error={error}
                disabled={disabled}
            />
            <Button variant="contained" style={buttonStyles}
                    onClick={onClickAddTaskToDoListHandler}
                    disabled={disabled}>+</Button>
        </div>
    );
})

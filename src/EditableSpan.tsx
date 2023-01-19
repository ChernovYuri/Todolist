import React, {ChangeEvent, useState} from 'react';

type PropsType = {
    oldTitle: string
    callBack:(newTitle: string) => void
}

export const EditableSpan = (props: PropsType) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(props.oldTitle)
    const focusHandler = () => {
        setEdit(!edit)
        updateOnBlurHandler()
    }

    const updateOnBlurHandler = () => {
            props.callBack(newTitle)
    }


    const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        edit
            ? <input onChange={onChangeLocalTitleHandler} autoFocus value={newTitle} onBlur={focusHandler}/>
            : <span onDoubleClick={focusHandler}>{props.oldTitle}</span>
    );
};


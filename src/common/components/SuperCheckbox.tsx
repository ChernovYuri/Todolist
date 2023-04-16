import React, {ChangeEvent} from 'react';

type PropsType = {
    checked: boolean
    callback: (checkedValue: boolean)=>void
    disabled: boolean
}

export const SuperCheckbox = (props: PropsType) => {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.callback(e.currentTarget.checked)
    }

    return (
        <input type={'checkbox'}
               onChange={onChangeHandler}
               checked={props.checked}/>
    );
};
import React, {ChangeEvent, FC} from 'react';

type Props = {
    checked: boolean
    callback: (checkedValue: boolean)=>void
    disabled: boolean
}

export const SuperCheckbox: FC<Props> = ({disabled, checked, callback}) => {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        callback(e.currentTarget.checked)
    }

    return (
        <input type={'checkbox'}
               onChange={onChangeHandler}
               checked={checked}
               disabled={disabled}
        />
    );
};
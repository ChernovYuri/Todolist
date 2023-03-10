import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {AddItemForm} from "../../AddItemForm";
import {action} from "@storybook/addon-actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default {
  taskTitle: 'TODOLIST/AddItemForm',
  component: AddItemForm,
  argTypes: {
    callback: {
      description: 'Button clicked inside form' },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
  callback: action('Button clicked inside form')
}
// ERROR STORY
const ErrorTemplate: ComponentStory<typeof AddItemForm> = (args) =>  {
  console.log('AddItemForm rendering')
  let [title, setTitle] = useState<string>('')
  let [error, setError] = useState<boolean>(true)

  const onClickAddTaskToDoListHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      args.callback(trimmedTitle)
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

  const errorMessage = error && <div style={{color: 'red'}}>Field is empty</div>

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
            // className={error ? 'inputError' : ''}
        />
        {/*<button onClick={onClickAddTaskToDoListHandler}>+</button>*/}
        <Button variant="contained" style={buttonStyles} onClick={onClickAddTaskToDoListHandler}>+</Button>
      </div>
  );
}

export const AddItemFormErrorStory = ErrorTemplate.bind({});

AddItemFormErrorStory.args = {
  callback: action('Button clicked inside form')
}
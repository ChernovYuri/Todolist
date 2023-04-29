import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {AddItemForm} from "common/components/AddItemForm";

export default {
  title: 'Example/AddItemForm',
  component: AddItemForm,
  argTypes: {
    addItem: {
      action: 'added',
    },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => (
    <AddItemForm {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

// export const WithError = Template.bind({});
// WithError.args = {
//   error: 'Title is required',
// };
//
// export const WithValue = Template.bind({});
// WithValue.args = {
//   value: 'Buy milk',
// };





/*
import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {AddItemForm} from "common/components/AddItemForm";
import {action} from "@storybook/addon-actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


type HandlerFunction = (title: string) => Promise<void>;

interface AddItemFormProps {
    addItem: HandlerFunction;
}

export default {
  taskTitle: 'TODOLIST/AddItemForm',
  component: AddItemForm,
  argTypes: {
    addItem: {
      description: 'Button clicked inside form' },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
  addItem: action('Button clicked inside form')
}
// ERROR STORY
const ErrorTemplate: ComponentStory<typeof AddItemForm> = (args) =>  {
  console.log('AddItemForm rendering')
  let [title, setTitle] = useState<string>('')
  let [error, setError] = useState<boolean>(true)

  const onClickAddTaskToDoListHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      args.addItem(trimmedTitle)
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
        {/!*<input
                value={title}
                onChange={onChangeLocalTitleHandler}
                onKeyDown={onKeyDownAddTaskToDoListHandler}
                className={error ? 'inputError' : ''}
            />*!/}
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
        {/!*<button onClick={onClickAddTaskToDoListHandler}>+</button>*!/}
        <Button variant="contained" style={buttonStyles} onClick={onClickAddTaskToDoListHandler}>+</Button>
      </div>
  );
}

export const AddItemFormErrorStory = ErrorTemplate.bind({});

AddItemFormErrorStory.args = {
  addItem: action('Button clicked inside form')
}*/
import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import App from "../../App";
import {Provider} from "react-redux";
import {store} from "../../reducers/store";
import {ReduxStoreProviderDecorator} from "../decorators/ReduxStoreProviderDecorator";

export default {
    taskTitle: 'TODOLIST/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App/>;
export const AppStory = Template.bind({});

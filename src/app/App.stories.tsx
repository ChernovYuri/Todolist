import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {ReduxStoreProviderDecorator} from "stories/decorators/ReduxStoreProviderDecorator";
import {App} from "app/App";

export default {
    taskTitle: 'TODOLIST/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App/>;
export const AppStory = Template.bind({});

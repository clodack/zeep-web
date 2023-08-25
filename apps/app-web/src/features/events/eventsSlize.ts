import { createSlice } from '@reduxjs/toolkit'

import {
  Categories,
  Configs,
  Events,
} from './types';

export type EventsState = {
  categories: Categories | undefined;
  configs: Configs | undefined;
  events: Events;
}

export const INITIAL_STATE: EventsState = {
  categories: undefined,
  configs: undefined,
  events: [],
}

export type Reducer<T> = {
  type: string;
  payload: T;
};

export const eventsSlise = createSlice({
  name: 'events',
  initialState: INITIAL_STATE,
  reducers: {
    setCategories: (state, action: Reducer<Categories>) => {
      state.categories = action.payload;
    },
    setConfigs: (state, action: Reducer<Configs>) => {
      state.configs = action.payload;
    },
    setEvents: (state, action: Reducer<Events>) => {
      state.events = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCategories, setConfigs, setEvents } = eventsSlise.actions

export const reducer = eventsSlise.reducer

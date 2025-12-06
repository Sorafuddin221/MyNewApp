'use client';
import '@/AdminStyles/UpdateRole.css';
import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
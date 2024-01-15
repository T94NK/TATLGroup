import { SchoolTimetable } from './pages/SchoolTimetable';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { timetableApi } from './api/timetableApi';
import { SnackbarProvider } from './components/Snackbar/Snackbar';

export const App = () => {
  return (
    <SnackbarProvider>
      <ApiProvider api={timetableApi}>
        <SchoolTimetable />
      </ApiProvider>
    </SnackbarProvider>
  );
};

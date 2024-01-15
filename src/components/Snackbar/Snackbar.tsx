import { createContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

interface INotify {
  isOpen: boolean;
  message: string;
  severity: 'error' | 'success';
}

interface ContextProps {
  notify: INotify;
  setNotify: (notify: INotify) => void;
}

export const SnackBarContext = createContext<ContextProps>({
  notify: {
    isOpen: false,
    message: '',
    severity: 'success'
  },
  setNotify: () => {}
});

export const SnackbarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notify, setNotify] = useState<INotify>({
    isOpen: false,
    message: '',
    severity: 'success'
  });

  return (
    <SnackBarContext.Provider
      value={{
        notify,
        setNotify
      }}
    >
      {children}
      <Snackbar
        open={notify.isOpen}
        onClose={() => {
          setNotify({
            message: '',
            severity: 'success',
            isOpen: false
          });
        }}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notify.severity}>{notify.message}</Alert>
      </Snackbar>
    </SnackBarContext.Provider>
  );
};

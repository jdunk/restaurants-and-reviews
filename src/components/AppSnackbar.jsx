import { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function AppSnackbar() {
  const [isOpen, setOpen] = useState(true);

  const handleClose = (e, reason) => {
    // if (reason === 'clickaway') return;

    setOpen(false);
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={{ marginTop: '50px' }}
      onClose={handleClose}
    >
      <Alert elevation={6} variant="filled" severity="error">
        You don't have permission to do that.
      </Alert>
    </Snackbar>
  );
};
import { useState } from 'react';
import { useSnackbar } from '../hooks/snackbar.jsx';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles({
  root: {
    '& .MuiAlert-root': {
      backgroundColor: '#fff9f9',
    },
  },
});

export default function AppSnackbar() {
  const { snackbar, setSnackbar, messageTypes } = useSnackbar();

  const handleClose = (e, reason) => {
    // if (reason === 'clickaway') return;

    setSnackbar({
      ...snackbar,
      isOpen: false,
    });
  };

  const classes = useStyles();

  return (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={snackbar.autoHideDuration}
      anchorOrigin={snackbar.anchorOrigin}
      onClose={handleClose}
      className={classes.root}
    >
      <Alert elevation={6} variant="outlined" severity="error">
        { snackbar.message ??
            snackbar.messageType ?
              messageTypes[snackbar.messageType] : 'Something happened.'
        }
      </Alert>
    </Snackbar>
  );
};
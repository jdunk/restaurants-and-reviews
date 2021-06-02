import { useState } from 'react';
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
  const [isOpen, setOpen] = useState(true);

  const handleClose = (e, reason) => {
    // if (reason === 'clickaway') return;

    setOpen(false);
  };

  const classes = useStyles();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
      className={classes.root}
    >
      <Alert elevation={6} variant="outlined" severity="error">
        You don't have permission to do that.
      </Alert>
    </Snackbar>
  );
};
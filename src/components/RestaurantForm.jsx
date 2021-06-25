import { useState } from 'react';

import useFormValues from '../hooks/useFormValues';
import useFormErrors from '../hooks/useFormErrors';
import { useAuth } from '../hooks/auth';
import { useApiClient } from '../hooks/useApiClient';

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function RestaurantForm({dialogOpen, onDialogClose, onNewRestaurant}) {
  let [formErrorMsg, setFormErrorMsg] = useState(null);
  let [isProcessing, setIsProcessing] = useState(false);

  const { auth } = useAuth();
  const { apiClient } = useApiClient();

  let {
    values,
    setValue,
    bindField
  } = useFormValues({
    name: '',
  });
  let {setFieldErrors, fieldHasError, errorMessageFor} = useFormErrors();

  const submit = async (e) => {
    e.preventDefault();
    setFormErrorMsg(null);
    setFieldErrors([]);
    setIsProcessing(true);

    try {
      const resp = await apiClient.post('/api/restaurants', {
        name: values.name,
      });

      if (!resp.data?.data) {
        throw new Error('Unexpected response from server')
      }

      setValue({ target: { name: 'name', value: '' } });
      setIsProcessing(false);
      onNewRestaurant(resp.data.data);
    } catch (e) {
      if (e?.config?._redirectPending) return;

      setIsProcessing(false);

      if (![400,422].includes(e?.response?.status) || !e?.response?.data) {
        setFormErrorMsg('Unknown error. Perhaps try again later.');
      }

      setFormErrorMsg(e?.response?.data?.error?.errors ? '' : e?.response?.data?.error?.message);

      const _fieldErrors = e?.response?.data?.error?.errors;
      if (!_fieldErrors) return;

      setFieldErrors(_fieldErrors);
    }
  }

  return (
    <Dialog open={dialogOpen} onClose={onDialogClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add a Restaurant</DialogTitle>
      <DialogContent>
        <Box width="400px" mt={1}>
          <Box py={0}>
          <form onSubmit={submit} noValidate autoComplete="off">
            <Box mb={2}>
              <TextField
                id="name"
                required
                variant="outlined"
                fullWidth
                label="Name"
                placeholder="Joe's Diner"
                error={fieldHasError('name')}
                helperText={errorMessageFor('name')}
                {...(bindField('name'))}
              />
            </Box>
            <Box color="error.main">
              {formErrorMsg}
            </Box>
          </form>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => submit(e)}
          disabled={isProcessing}
          disableElevation
        >
          <Box mr={isProcessing ? 1 : 0}>
            Submit
          </Box>
          
          { isProcessing && 
          <CircularProgress size={25} color='inherit' />
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
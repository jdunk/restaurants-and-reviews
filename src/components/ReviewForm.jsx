import { useState, useEffect } from 'react';

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
import FormHelperText from '@material-ui/core/FormHelperText';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import TextField from '@material-ui/core/TextField';

export default function ReviewForm({restaurant, dialogOpen, onDialogClose, onSaveReview}) {
  const [formErrorMsg, setFormErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ratingLabel, setRatingLabel] = useState(-1);


  const { auth } = useAuth();
  const { apiClient } = useApiClient();

  let {
    values,
    setValueDirect,
    bindField
  } = useFormValues({
    rating: -1,
    review: '',
  });
  let {setFieldErrors, fieldHasError, errorMessageFor} = useFormErrors();

  const ratingLabels = {
    1: 'Terrible',
    2: 'Poor',
    3: 'Fair',
    4: 'Good',
    5: 'Excellent',
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormErrorMsg(null);
    setFieldErrors([]);
    setIsProcessing(true);

    try {
      let resp;
      
      resp = await apiClient.post(`/api/restaurants/${restaurant._id}/reviews`, {
        rating: values.rating === -1 ? null : values.rating,
        body: values.body,
      });

      if (!resp.data?.data) {
        throw new Error('Unexpected response from server')
      }

      setValueDirect('body', '');
      setIsProcessing(false);
      onSaveReview(resp.data.data);
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
      <DialogTitle id="form-dialog-title">Add a Review</DialogTitle>
      <DialogContent>
        <Box width="400px" mt={1}>
          <Box py={0}>
          <form onSubmit={submit} noValidate autoComplete="off">
            <Box mb={2}>
              <Box display="flex" alignItems="center">
                <Box height="24px">
                  <Rating
                    {...(bindField('rating'))}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    onChangeActive={(e, value) => {
                      setRatingLabel(value);
                    }}
                  />
                </Box>
                <Box lineHeight="24px" height="21px" ml={1}>
                {
                  ratingLabel !== -1 ?
                    ratingLabels[ratingLabel]
                    :
                    (values.rating ? ratingLabels[values.rating] : null)
                }
                </Box>
              </Box>{/* end flex */}
              <Box ml={1}>
                <FormHelperText id="rating-helper-text" error={fieldHasError('rating')}>
                  {errorMessageFor('rating')}
                </FormHelperText>
              </Box>
            </Box>
            <Box mb={2} mt={1}>
              <TextField
                id="review-body"
                required
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                rowsMax={10}
                label="Review"
                error={fieldHasError('body')}
                helperText={errorMessageFor('body')}
                {...(bindField('body'))}
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
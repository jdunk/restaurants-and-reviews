import { useState } from 'react';
import useFormValues from '../hooks/useFormValues';
import useFormErrors from '../hooks/useFormErrors';
import { useHistory } from 'react-router-dom';
import apiClient from '../utils/client/api-client';
import { useAuth } from '../hooks/auth';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root, & .MuiFormControl-root': {
      width: '260px'
    },
    '&': {
      width: '260px'
    }
  }
});

export default function LogInPage(props) {
  const history = useHistory();
  const { auth } = useAuth();

  let {
    values,
    bindField
  } = useFormValues({
    email: '',
    password: '',
  });

  let {setFieldErrors, fieldHasError, errorMessageFor} = useFormErrors();

  let [showPassword, setShowPassword] = useState(false);
  let [formErrorMsg, setFormErrorMsg] = useState(null);
  let [isProcessing, setIsProcessing] = useState(false);

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(curr => !curr);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const logIn = async (e) => {
    e.preventDefault();
    setFormErrorMsg(null);
    setFieldErrors([]);
    setIsProcessing(true);

    let resp;

    try {
      resp = await apiClient.post('/api/auth', {
        email: values.email,
        password: values.password
      });

      console.log({ logInResponse: resp });

      if (!resp.data?.data?.user) {
        throw new Error('Unexpected response from server')
      }

      auth.setUser(resp.data.data.user);
      history.push('/restaurants');
    } catch (e) {
      setIsProcessing(false);

      if (![400,403].includes(e.response?.status)) {
        setFormErrorMsg('Unknown error. Perhaps try again later.');
      }

      setFormErrorMsg(e.response.data?.error?.message);

      const _fieldErrors = e.response.data?.error?.errors;
      if (!_fieldErrors) return;

      setFieldErrors(_fieldErrors);
    }
  }

  return (
    <Container align="center">
    <Box width="400px">
      <Paper elevation={3}>

      <Box py={4}>
      <form className={classes.root} noValidate autoComplete="off">
        <Box mb={1}>
          <TextField
            variant="outlined"
            label="Email"
            placeholder="youremail@domain.com"
            type="email"
            id="email"
            autoComplete='on'
            required
            error={fieldHasError('email')}
            helperText={errorMessageFor('email')}
            {...(bindField('email'))}
          />
        </Box>
        <Box mb={2}>
          <FormControl
            required
            variant="outlined"
            error={fieldHasError('password')}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...(bindField('password'))}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={<>Password *</>}
            />
            <FormHelperText id="password-helper-text">
              {errorMessageFor('password')}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box color="error.main">
          {formErrorMsg}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => logIn(e)}
          fullWidth
          disabled={isProcessing}
        >
          <Box mr={1}>
          Log In
          </Box>
          
          { isProcessing && 
          <CircularProgress size={25} color='white' />
          }
        </Button>
      </form>
      </Box>
      </Paper>

    </Box>
    </Container>
  )
}

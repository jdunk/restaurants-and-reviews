import { useState } from 'react';
import useFormValues from '../hooks/useFormValues';
import useFormErrors from '../hooks/useFormErrors';
import { useHistory } from 'react-router-dom';
import apiClient from '../utils/client/api-client';
import { useAuth } from '../hooks/auth';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root, & .MuiFormControl-root': {
      width: '300px'
    },
    '&': {
      width: '300px'
    }
  }
});

export default function SignUpPage(props) {
  const history = useHistory();
  const { auth } = useAuth();

  let {
    values,
    bindField
  } = useFormValues({
    name: '',
    email: '',
    password: '',
    accountType: '',
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

  const signUp = async (e) => {
    e.preventDefault();
    setFormErrorMsg(null);
    setFieldErrors([]);
    setIsProcessing(true);

    let resp;

    try {
      resp = await apiClient.post('/api/signup', values);

      if (!resp.data?.data?.user) {
        throw new Error('Unexpected response from server')
      }

      auth.setUser(resp.data.data.user);
      history.push('/restaurants');
    } catch (e) {
      setIsProcessing(false);

      if (e?.response?.status === 403) {
        setFormErrorMsg('Permission error.');
        return;
      }

      if (![400,422].includes(e?.response?.status) || !e?.response?.data) {
        setFormErrorMsg('Unknown error. Perhaps try again later.');
      }

      setFormErrorMsg(e?.response?.data?.error?.message);

      const _fieldErrors = e?.response?.data?.error?.errors;
      if (!_fieldErrors) return;

      setFieldErrors(_fieldErrors);
    }
  }

  return (
    <Container align="center">
    <Box width="400px">
      <h2>Join us!</h2>
      <Paper elevation={3}>

      <Box py={3}>
      <form className={classes.root} noValidate autoComplete="off">
        <Box mb={1}>
          <TextField
            variant="outlined"
            label="Name"
            placeholder="Firstname McLastname"
            type="text"
            id="name"
            autoComplete='on'
            required
            error={fieldHasError('name')}
            helperText={errorMessageFor('name')}
            {...(bindField('name'))}
          />
        </Box>
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
        <Box mb={2}>
          <FormControl
            component="fieldset"
            required
            error={fieldHasError('accountType')}
          >
            <FormLabel component="legend">Account type</FormLabel>

            <RadioGroup
              row
              required
              {...(bindField('accountType'))}
              aria-label="account-type"
            >
              <Box ml={2} mr={3}>
                <FormControlLabel value="regular" control={<Radio color="primary" />} label="Reviewer" />
              </Box>
              <Box>
                <FormControlLabel value="owner" control={<Radio color="primary" />} label="Owner" />
              </Box>
            </RadioGroup>
            <FormHelperText id="accountType-helper-text">
              {errorMessageFor('accountType')}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box color="error.main">
          {formErrorMsg}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => signUp(e)}
          fullWidth
          disabled={isProcessing}
        >
          <Box mr={1}>
          Sign Up
          </Box>
          
          { isProcessing && 
            <CircularProgress size={25} color='inherit' />
          }
        </Button>
        <Box mt={3}>
          Already have an account?{' '}
          <Link color="secondary" href="/login" onClick={(e) => {
            e.preventDefault();
            history.push('/login');
          }}>
            Log In &raquo;
          </Link>
        </Box>
      </form>
      </Box>
      </Paper>

    </Box>
    </Container>
  )
}

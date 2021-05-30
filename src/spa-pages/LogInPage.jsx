import React from 'react'
import { useHistory } from 'react-router-dom';
import apiClient from '../utils/client/api-client';
import { useAuth } from '../hooks/auth';
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
  console.log({ loginpageprops: props })
  let [email, setEmail] = React.useState('')
  let [password, setPassword] = React.useState('')
  let [showPassword, setShowPassword] = React.useState(false)
  let [formErrorMsg, setFormErrorMsg] = React.useState('')
  let [isProcessing, setIsProcessing] = React.useState(false)

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(curr => !curr);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const logIn = async (e) => {
    e.preventDefault();
    console.log({ auth });
    setIsProcessing(true);

    try {
      const resp = await apiClient.post('/api/auth', { email, password });

      console.log({ logInResponse: resp });

      if (!resp.data?.data?.user) {
        throw new Error('Unexpected response from server')
      }

      auth.setUser(resp.data.data.user);
      history.push('/restaurants');
    } catch (e) {
      setIsProcessing(false);
      setFormErrorMsg(e.toString());
      console.log(e);
    }
  }

  return (
    <Box align="center">
      <form className={classes.root} noValidate autoComplete="off">
        <Box mb={1}>
          <TextField
            variant="outlined"
            size="medium"
            label="Email"
            placeholder="youremail@domain.com"
            type="email"
            id="email"
            name="email"
            autoComplete='on'
            required
            error={false}
            helperText={''}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <FormControl required variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
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
          </FormControl>
        </Box>
        <div>
          {formErrorMsg}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => logIn(e)}
          width="260px"
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
  )
}

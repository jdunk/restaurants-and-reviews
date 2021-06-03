import { useState, useRef } from 'react';
import apiClient from '../utils/client/api-client';
import { useAuth } from '../hooks/auth';
import { useHistory, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Box from '@material-ui/core/Box'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function AuthUser() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const anchorEl = anchorRef.current;
  const { auth } = useAuth();
  const history = useHistory();

  const { user, setUser } = auth;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  if (user === null)
    return null;

  if (user === false)
    return (
      <Link to='/login'>Log In</Link>
    );

  const logOut = async (e) => {
    e.preventDefault();
    setOpen(false);

    try {
      await apiClient.get('/api/logout')
      setUser(false);
      history.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  const handleClose = () => {
    console.log('handleClose')
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}><>

      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        color="inherit"
        style={{textTransform: 'none'}}
        onClick={handleToggle}
      >
        <Box mr={1} clone>
          <AccountCircleIcon />
        </Box>

        { user.name }
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <MenuItem onClick={logOut}>Log out</MenuItem>
      </Menu>
      </>
    </ClickAwayListener>
  );
}
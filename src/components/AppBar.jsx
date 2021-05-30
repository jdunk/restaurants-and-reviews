import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from '../hooks/auth';
import AuthUser from './AuthUser';
import AppDrawer from './AppDrawer';

export default function AppBar() {
  const { auth } = useAuth();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  
  const setDrawerIsOpenFromEvent = isOpen => event => {
    console.log({
      setDrawerIsOpenFromEvent: isOpen
    });
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      console.log('aborted');
      return;
    }

    setDrawerIsOpen(isOpen);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiAppBar position="static">
        <Toolbar>
          <IconButton onClick={setDrawerIsOpenFromEvent(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Restaurants &amp; Ratings
          </Typography>
          <AuthUser user={auth.user} />
        </Toolbar>
      </MuiAppBar>
      <AppDrawer isOpen={drawerIsOpen} onClose={setDrawerIsOpenFromEvent(false)} />
    </div>
  );
};

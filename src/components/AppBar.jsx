import { useState, useLayoutEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AuthUser from './AuthUser';
import AppDrawer from './AppDrawer';

export default function AppBar() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const appBarEl = useRef();
  const containerEl = useRef();
  
  useLayoutEffect(() => {
    containerEl.current.style.height = `${Number(appBarEl.current.offsetHeight) + 20}px`;
  }, [appBarEl, containerEl]);

  const setDrawerIsOpenFromEvent = isOpen => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
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
    <div className={classes.root} ref={containerEl}>
      <MuiAppBar position="fixed" ref={appBarEl}>
        <Toolbar>
          <IconButton onClick={setDrawerIsOpenFromEvent(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Restaurants &amp; Reviews
          </Typography>
          <AuthUser />
        </Toolbar>
      </MuiAppBar>
      <AppDrawer isOpen={drawerIsOpen} onClose={setDrawerIsOpenFromEvent(false)} />
    </div>
  );
};

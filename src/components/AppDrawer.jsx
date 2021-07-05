import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useAuth } from '../hooks/auth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';

import routes from '../config/spa-routes';

export default function AppDrawer({ isOpen, onClose }) {
  const { auth } = useAuth();
  const history = useHistory();
  
  const useStyles = makeStyles((theme) => ({
    list: {
      width: 250,
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <Drawer open={isOpen} onClose={onClose}>
        <div
          className={classes.list}
          role="presentation"
          onClick={onClose}
          onKeyDown={onClose}
        >
          <List>
            {
              routes.map((route, i) => {
                return (
                  <ListItem button key={route.path} onClick={() => history.push(route.path) }>
                    <ListItemText primary={route.label} />
                  </ListItem>
                )
              })
            }
          </List>
        </div>
      </Drawer>
    </div>
  );
};

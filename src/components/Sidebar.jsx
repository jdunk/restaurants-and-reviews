import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined';
import Grid from '@material-ui/core/Grid';
import InsertEmoticonOutlinedIcon from '@material-ui/icons/InsertEmoticonOutlined';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import StarIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles({
  'sidebar': {
    border: '2px solid #ddd',
    borderRadius: '3px',
    backgroundColor: '#f6f6f6',
    '& .MuiSvgIcon-root': {
      fontSize: '3.0rem',
      color: '#ddd',
    },
  },
});

export default function Sidebar() {
  const classes = useStyles();

  return (
    <Box className={ classes.sidebar } py={8}>
      <Grid container direction="column" spacing={10}>
        <Grid item>
          <Grid container justify="space-evenly">
            <Grid item>
              <RestaurantIcon />
            </Grid>
            <Grid item>
              <FastfoodOutlinedIcon />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={0} justify="space-evenly">
            <Grid item>
              <InsertEmoticonOutlinedIcon />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={0} justify="space-evenly">
            <Grid item>
              <FastfoodOutlinedIcon />
            </Grid>
            <Grid item>
              <LocalDiningIcon />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={0} justify="space-evenly">
            <Grid item>
              <LocalBarIcon />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={0} justify="space-evenly">
            <Grid item>
              <StarIcon />
            </Grid>
            <Grid item>
              <FastfoodOutlinedIcon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

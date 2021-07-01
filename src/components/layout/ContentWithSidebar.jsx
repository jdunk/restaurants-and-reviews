import Sidebar from '../Sidebar';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default function ContentWithSidebar({ children }) {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        {children}
      </Grid>
      <Hidden smDown>
        <Grid item md={4} align="center">
          <Sidebar />
        </Grid>
      </Hidden>
    </Grid>
  );
}
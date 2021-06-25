import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/auth';
import { useApiClient } from '../hooks/useApiClient';

import RestaurantForm from '../components/RestaurantForm';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

export default function RestaurantsPage() {
  const { auth } = useAuth();
  const { apiClient } = useApiClient();

  async function getRestaurants() {
    try {
      const resp = await apiClient.get('/api/restaurants');

      if (resp?.data?.data)
        return resp.data.data;

      return;
    }
    catch(e) {
      if (e.config?._redirectPending) return;
    }
  }

  const [restaurants, setRestaurants] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(async () => {
    const res = await getRestaurants();
    setRestaurants(res);
  }, []);

  const onDialogClose = () => setDialogOpen(false);

  const onNewRestaurant = (newResto) => {
    setRestaurants([
      ...(restaurants || []),
      newResto,
    ]);
    onDialogClose();
  };

  const deleteRestaurant = async _id => {
    console.log(`Delete restaurant: ${_id}`)
    try {
      const resp = await apiClient.delete(`/api/restaurants/${_id}`);
      console.log({ deleteRestoResp: resp })

      setRestaurants(restaurants.filter(x => x._id != _id));
    }
    catch(e) {
      console.log({ deleteRestoError: e })
    }
  };

  const isOwner = auth?.user?.role === 'owner';

  return (<Container>
    <h2>{ isOwner ? 'My ' : '' }Restaurants</h2>
    {
      isOwner ? (<>
        <Box borderRadius={20} pr={2} clone>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add
          </Button>
        </Box>
        <RestaurantForm dialogOpen={dialogOpen} onDialogClose={onDialogClose} onNewRestaurant={onNewRestaurant} />
      </>) : null
    }

    <Box mt={3}>
    {
      restaurants === false ? <div>An error occurred.</div> : (
        !restaurants ?
          '(Skeleton here)'
          :
          restaurants.map(resto =>
            <Box py={2} px={2} mb={3}
              key={resto._id}
              clone
            >
            <Paper
              key={resto._id}
            >
              <div>
              <strong>{ resto.name }</strong>
              </div>
              <IconButton
                aria-label="delete"
                onClick={() => deleteRestaurant(resto._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
            </Box>
          )
      )
    }
    </Box>
  </Container>);
};
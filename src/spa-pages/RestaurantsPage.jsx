import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { useApiClient } from '../hooks/useApiClient';
import { makeStyles } from '@material-ui/core/styles';

import RestaurantForm from '../components/RestaurantForm';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import ContentWithSidebar from '../components/layout/ContentWithSidebar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import Select from '@material-ui/core/Select';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles({
  'toolbarRoot': {
    '& .MuiSelect-selectMenu': {
      fontSize: '0.8rem',
      padding: '3px 25px 5px 6px',
    }
  },
  'restoRoot': {
    '& .icon': {
      backgroundColor: '#e3e3e3',
      height: '5.2rem',
      width: '5.2rem',
      '& .MuiSvgIcon-root': {
        width: '2.3rem',
        height: '5.2rem',
        color: '#bbc',
      },
    },
    '& .restoName': {
      fontSize: '1.2rem',
      '& a': {
        color: '#02b',
      },
    },
    '& .rating': {
      marginTop: '2px',
      marginLeft: '-3px',
      '& > span': {
        fontSize: '1.2rem',
      },
    },
    '& .numReviews': {
      fontSize: '0.92rem',
    },
    '& .noReviews': {
      color: '#777',
    },
  }
});

const sorters = {
  'name-asc': (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  'name-desc': (a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
  'rating-asc': () => {},
  'rating-desc': () => {},
};

export default function RestaurantsPage() {
  const { auth } = useAuth();
  const { apiClient } = useApiClient();
  const history = useHistory();

  async function getRestaurants() {
    try {
      const resp = await apiClient.get('/api/restaurants');

      if (resp?.data?.data)
        return setRestaurants(resp.data.data);

      throw new Error('Unexpected response from server');
    }
    catch(e) {
      if (e.config?._redirectPending) return;

      setRestaurants(false);
    }
  }

  const [restaurants, setRestaurants] = useState();
  const [editId, setEditId] = useState();
  const [editName, setEditName] = useState();
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(async () => {
    getRestaurants();
  }, []);

  const onDialogClose = () => setDialogOpen(false);

  const onSaveRestaurant = (resto) => {
    if (editId) {
      setRestaurants(restaurants.map(r => r._id === resto._id ? resto : r));
    }
    else {
      setRestaurants([
        ...(restaurants || []),
        resto,
      ]);
    }
    setEditId(undefined);
    setEditName(undefined);
    onDialogClose();
  };

  const deleteRestaurant = async _id => {
    try {
      const resp = await apiClient.delete(`/api/restaurants/${_id}`);

      setRestaurants(restaurants.filter(x => x._id != _id));
    }
    catch(e) {
      console.error({ deleteRestoError: e })
    }
  };

  const isOwner = auth?.user?.role === 'owner';

  const classes = useStyles();

  const addRestaurant = () => {
    setDialogOpen(true);
    setEditId(undefined);
    setEditName(undefined);
  };

  const editRestaurant = (r) => {
    setDialogOpen(true);
    setEditId(r._id);
    setEditName(r.name);
  };

  const goToRestoPage = (slug, e) => {
    e.preventDefault();
    history.push(`/restaurants/${slug}`);
  };

  return (<Container>
    <h1>{ isOwner ? 'My ' : '' }Restaurants</h1>
    {
      isOwner ? (<>
        <Box borderRadius={20} pr={2} mb={3} clone>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={ addRestaurant }
          >
            Add
          </Button>
        </Box>
        <RestaurantForm
          dialogOpen={dialogOpen}
          onDialogClose={onDialogClose}
          onSaveRestaurant={onSaveRestaurant}
          editId={ editId }
          editName={ editName }
        />
      </>) : null
    }

    <ContentWithSidebar>
      <Box
        display="flex"
        py={1} px={2} mb={3}
        boxShadow={1}
        className={classes.toolbarRoot}
        style={{
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          border: '1px solid #e0e0dd',
        }}
      >
        <Box mr={1}>
          <strong>Sort By:</strong>
        </Box>
        <FormControl>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
          >
            <MenuItem value={'rating-desc'}>Highest Avg Rating</MenuItem>
            <MenuItem value={'rating-asc'}>Lowest Avg Rating</MenuItem>
            <MenuItem value={'name-asc'}>Name (A-Z)</MenuItem>
            <MenuItem value={'name-desc'}>Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
      {
        restaurants === false ? <div>An error occurred.</div> : (
          !restaurants ?
            '(Skeleton here)'
            :
            restaurants.sort(sorters[sortOrder]).map(resto =>
              <Box py={1} px={1} mb={3}
                key={resto._id}
                clone
              >
              <Paper
                key={resto._id}
                style={{
                  cursor: 'pointer'
                }}
                className={ classes.restoRoot }
                onClick={(e) => goToRestoPage(resto.slug, e)}
              >
                <Box display="flex" alignItems="center">
                  <Box className="icon" align="center">
                    <RestaurantIcon />
                  </Box>
                  <Box ml={1.5}>
                    <Box className="restoName">
                      <Link
                        onClick={(e) => goToRestoPage(resto.slug, e)}
                        href={`/restaurants/${resto.slug}`}
                      >
                        <strong>{ resto.name }</strong>
                      </Link>
                    </Box>
                    {
                      resto.numReviews ? (<>
                        <Box className="rating">
                          <Rating
                            precision={0.05}
                            value={3.55}
                            readOnly
                          />
                        </Box>
                        <Box className="numReviews">
                          { resto.numReviews } reviews
                        </Box>
                      </>)
                      :
                      /* Restaurant has no reviews yet */
                      (<>
                        <Box className="rating">
                          <Rating
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            readOnly
                          />
                        </Box>
                        <Box className="noReviews">
                          No reviews yet
                        </Box>
                      </>)
                    }
                  </Box>
                </Box>

                {
                  auth?.user?.role === 'regular' ? null :
                  <div>
                    <IconButton
                      aria-label="edit"
                      onClick={() => editRestaurant(resto)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteRestaurant(resto._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              </Paper>
              </Box>
            )
        )
      }
      </Box>
    </ContentWithSidebar>
  </Container>);
};
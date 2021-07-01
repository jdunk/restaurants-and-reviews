import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/auth';
import { useApiClient } from '../hooks/useApiClient';
import { makeStyles } from '@material-ui/core/styles';

import ReviewForm from '../components/ReviewForm';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import ContentWithSidebar from '../components/layout/ContentWithSidebar';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  'toolbarRoot': {
    '& .MuiSelect-selectMenu': {
      fontSize: '0.8rem',
      padding: '3px 25px 5px 6px',
    }
  },
  'reviewRoot': {
    '& .reviewRating': {
      '& .text': {
        fontSize: '1.8rem',
        fontWeight: 700,
        lineHeight: 1,
      },
      '& .textDenominator': {
        fontSize: '1rem',
        fontWeight: 400,
        color: '#bbb',
        paddingLeft: '2px',
        letterSpacing: '1px',
      },
    },
    '& .reviewDate': {
      lineHeight: '200%',
      color: '#777',
    }
  },
});

const sorters = {
  'date-asc': (a, b) => a.createdAt - b.createdAt,
  'date-desc': (a, b) => b.createdAt - a.createdAt,
  'rating-asc': () => {},
  'rating-desc': () => {},
};

const formatReviewDate = (isoDateStr) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = new Date(isoDateStr);

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default function RestaurantPage({ match }) {
  const { auth } = useAuth();
  const { apiClient } = useApiClient();

  async function getRestaurant() {
    try {
      const resp = await apiClient.get(`/api/restaurants/${match?.params?.slug}`);

      if (resp?.data?.data)
        return setRestaurant(resp.data.data);

      throw new Error('Unexpected response from server');
    }
    catch(e) {
      if (e.config?._redirectPending) return;

      setRestaurant(false);
    }
  }

  const [restaurant, setRestaurant] = useState();
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [dialogOpen, setDialogOpen] = useState(false);

  const setReviews = (reviews) => {
    setRestaurant({
      ...restaurant,
      reviews,
    })
  };

  useEffect(async () => {
    getRestaurant();
  }, []);

  const onDialogClose = () => setDialogOpen(false);

  const onSaveReview = (review) => {
    setReviews([
      ...(restaurant.reviews || []),
      review,
    ]);
    onDialogClose();
  };

  const deleteReview = async _id => {
    try {
      const resp = await apiClient.delete(`/api/restaurants/${restaurant._id}/reviews/${_id}`);

      setReviews(restaurant.reviews.filter(x => x._id != _id));
    }
    catch(e) {
      console.error({ deleteReviewError: e })
    }
  };

  const isRegUser = auth?.user?.role === 'regular';

  const classes = useStyles();

  const addReview = () => {
    setDialogOpen(true);
  };

  return (<Container>
    <h1>{ restaurant?.name }</h1>
    {
      isRegUser ? (<>
        <Box borderRadius={20} pr={2} mb={3} clone>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={ addReview }
          >
            Review
          </Button>
        </Box>
        <ReviewForm
          restaurant={restaurant}
          dialogOpen={dialogOpen}
          onDialogClose={onDialogClose}
          onSaveReview={onSaveReview}
        />
      </>) : null
    }

    <ContentWithSidebar>
    <Box
      display="flex"
      alignItems="center"
      py={1} px={2}
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
          <MenuItem value={'rating-desc'}>Highest Rating</MenuItem>
          <MenuItem value={'rating-asc'}>Lowest Rating</MenuItem>
          <MenuItem value={'date-desc'}>Newest first</MenuItem>
          <MenuItem value={'date-asc'}>Oldest first</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Box mt={3}>
    {
      restaurant === false ? <div>An error occurred.</div> : (
        !restaurant ?
          '(Skeleton here)'
          :
          (restaurant.reviews || []).sort(sorters[sortOrder]).map(review =>
            <Box py={2} px={2} mb={3}
              key={review._id}
              clone
            >
            <Paper
              key={review._id}
              className={ classes.reviewRoot }
            >
              <div className="reviewBody">
                <Box className="reviewRating" display="flex" mb={1}>
                  <div className="text">
                    {review.rating}
                  </div>
                  <Box className="textDenominator">
                    /5
                  </Box>
                  <Box className="stars" ml={1}>
                    <Rating
                      value={review.rating}
                      readOnly
                    />
                  </Box>
                  <Box className="reviewDate" ml={1}>
                    { formatReviewDate(review.createdAt) }
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" className="author">
                  <Box py={0.8} px={1} className="name" style={{ border: '1px solid #ccc' }}>
                    <strong>{ review.author.name }</strong>
                  </Box>
                </Box>
                <div className="reviewText">
                  { review.body.split('\n').map((line, i) => <p key={i}>{line}</p>) }
                </div>
                {
                  auth?.user?.role !== 'admin' && review.author?._id !== auth.user?._id ? null :
                  <div>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteReview(review._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              </div>
            </Paper>
            </Box>
          )
      )
    }
    </Box>
    </ContentWithSidebar>
  </Container>);
};
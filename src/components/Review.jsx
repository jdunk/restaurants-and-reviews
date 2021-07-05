import { useAuth } from '../hooks/auth';

import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';

const formatReviewDate = (isoDateStr) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = new Date(isoDateStr);

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const useStyles = makeStyles({
  'reviewRoot': {
    '& .reviewRating': {
      lineHeight: 1,
      '& .text': {
        fontSize: '1.8rem',
        fontWeight: 700,
      },
      '& .textDenominator': {
        alignSelf: 'flex-start',
        fontSize: '1rem',
        fontWeight: 400,
        color: '#bbb',
        paddingTop: '1px',
        paddingLeft: '2px',
        letterSpacing: '1px',
      },
    },
    '& .reviewDate': {
      color: '#777',
    }
  },
});

export default function Review(review) {
  const { auth } = useAuth();
  const classes = useStyles();

  return (
    <Box py={2} px={2} mb={3}
      key={review._id}
      clone
    >
    <Paper
      key={review._id}
      className={ classes.reviewRoot }
    >
      <div className="reviewBody">
        <Box className="reviewRating" display="flex" alignItems="center" mb={1}>
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
  );
}
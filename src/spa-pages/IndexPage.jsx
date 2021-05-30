import { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress';

export default function IndexPage({ query }) {
  useEffect(() => {
  }, [])

  return (
    <Box align='center'>
      <CircularProgress size={60} />
    </Box>
  )
}
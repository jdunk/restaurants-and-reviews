import { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress';

export default function IndexPage(props) {
  useEffect(() => {
    console.log({ props })
  }, [])

  return (
    <Box align='center'>
      <CircularProgress size={40} />
    </Box>
  )
}
import { useState, useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { capitalize } from '../utils/client/string-helper';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export default function UsersPage() {
  const [users, setUsers] = useState();
  const { apiClient } = useApiClient();

  useEffect(async () => {
    // Fetch Users
    try {
      const resp = await apiClient.get('/api/users');

      if (! resp.data?.data)
        throw new Error('Error fetching users.');

      setUsers(resp.data.data);
    }
    catch(e) {
      console.error({ apiClientErrorUsersPage: e })
      if (e?.config?._redirectPending) return;

      setUsers(false);
    }
  }, []);

  return (<Container>
    <h2>Users</h2>
    <div>
    {
      users === false ? <div>An error occurred.</div> : (
        !users ?
        '(Skeleton here)'
        :
        users.map(user => (
          <Paper elevation={1}>
            <Box py={1} px={2} mb={3}>
              <div>
                <strong>{user.name}</strong> <span>({capitalize(user.role)})</span>
              </div>
              <div>
                {user.email}
              </div>
            </Box>
          </Paper>
        ))
      )
    }
    </div>
  </Container>);
};
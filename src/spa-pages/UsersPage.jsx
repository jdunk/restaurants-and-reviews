import { useState, useEffect } from 'react';
import apiClient from '../utils/client/api-client';
import { capitalize } from '../utils/client/string-helper';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export default function UsersPage() {
  async function getUsers() {
    try {
      const resp = await apiClient.get('/api/users');
      console.log({ getUsersResp: resp })

      if (resp.data?.data)
        return resp.data.data;

      return;
    }
    catch(e) {
      
      console.log({ apiClientErrorUsersPage: e })
      if (e?.config?._redirectPending) return;
    }
  }

  const [users, setUsers] = useState();

  useEffect(async () => {
    const res = await getUsers();
    setUsers(res);
  }, []);

  return (<Container>
    <h2>Users</h2>
    <div>{ !users ? '(Skeleton here)' : users.map(user => (
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
    )) }</div>
  </Container>);
};
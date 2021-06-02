import { useState, useEffect } from 'react';
import apiClient from '../utils/client/api-client';

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
      if (e.config._redirectPending) return;
    }
  }

  const [users, setUsers] = useState();

  useEffect(async () => {
    const res = await getUsers();
    console.log({ getUsers: res });
    setUsers(res);
  }, []);

  return (<>
    <h3>Users Page</h3>
    <div>{ !users ? '(Skeleton here)' : <pre>{ JSON.stringify(users, null, 2) }</pre> }</div>
  </>);
};
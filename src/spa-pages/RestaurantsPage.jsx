import { useState, useEffect } from 'react';
import apiClient from '../utils/client/api-client';

export default function RestaurantsPage() {
  async function getRestaurants() {
    const resp = await apiClient.get('/api/restaurants');
    console.log({ getRestosResp: resp })

    if (resp.data?.data)
      return resp.data.data;

    return false;
  }

  const [restaurants, setRestaurants] = useState();

  useEffect(async () => {
    setRestaurants(await getRestaurants());
  }, []);

  return (<>
    <h3>Restaurants Page</h3>
    <pre>
      {
        JSON.stringify(restaurants, null, 2)
      }
    </pre>
  </>);
};
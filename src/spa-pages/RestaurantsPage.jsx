import { useState, useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';

export default function RestaurantsPage() {
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

  useEffect(async () => {
    const res = await getRestaurants();
    setRestaurants(res);
  }, []);

  return (<>
    <h3>Restaurants Page</h3>
    <div>{ !restaurants ? '(Skeleton here)' : <pre>{ JSON.stringify(restaurants, null, 2) }</pre> }</div>
  </>);
};
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/current_user');
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

return useAuth;

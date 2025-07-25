import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const RealUserCount: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('waitlist_users')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching user count:', error);
          setUserCount(null);
        } else {
          setUserCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch user count:', err);
        setUserCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) {
    return (
      <span className="text-sm animate-pulse">
        Loading community...
      </span>
    );
  }

  if (userCount === null || userCount === 0) {
    return (
      <span className="text-sm">
        Early Access Community
      </span>
    );
  }

  return (
    <span className="text-sm">
      {userCount === 1 ? '1 member' : `${userCount} members`} joined
    </span>
  );
};

export default RealUserCount;
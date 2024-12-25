import React, { useState, useContext, useEffect } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { useAuth0 } from '@auth0/auth0-react';
import UserDetailContext from '../../context/UserDetailContext';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { toFav } from '../../utils/api';

const Heart = ({ id }) => {
  const { user, isAuthenticated } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [heartColor, setHeartColor] = useState('white');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userDetails?.favourities?.includes(id)) {
      setHeartColor('#fa3e5f');
    }
  }, [userDetails, id]);

  const { mutate: like } = useMutation({
    mutationFn: () => toFav(id, user?.email, userDetails?.token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourities: [...(prev.favourities || []), id],
      }));
      queryClient.invalidateQueries(['userDetails']);
      toast.success('Property liked');
    },
    onError: (error) => {
      toast.error('Error liking property');
      console.error(error);
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like the property');
      return;
    }

    if (!id) {
      toast.error('Invalid property ID');
      return;
    }

    if (heartColor === 'white') {
      setHeartColor('#fa3e5f');
      like();
    } else {
      setHeartColor('white');
      // Remove from local state but not from database
      setUserDetails((prev) => ({
        ...prev,
        favourities: prev.favourities.filter((favId) => favId !== id),
      }));
      queryClient.invalidateQueries(['userDetails']);
      toast.success('Property unliked');
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
    />
  );
};

export default Heart;
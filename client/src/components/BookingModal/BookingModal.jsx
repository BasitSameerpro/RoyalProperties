import React, { useState, useContext } from "react";
import { Modal, Button, DatePicker } from "@mantine/core";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { bookVisit } from "../../utils/api";

const BookingModal = ({ opened, setOpened, propertyId }) => {
  const [value, setValue] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const handleBookingSuccess = () => {
    setUserDetails((prev) => ({
      ...prev,
      bookings: [...(prev.bookings || []), { propertyId, date: value.toISOString() }]
    }));
    setOpened(false);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        return await bookVisit(propertyId, user.email, value);
      } catch (error) {
        console.error("Booking visit error:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: handleBookingSuccess,
    onError: (error) => {
      toast.error("Residency already booked");
    }
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a visit");
      return;
    }
    mutate();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Select your date to visit"
      centered
    >
      <div className="flexColCenter">
        <DatePicker value={value} onChange={setValue} minDate={new Date()} />
        <Button 
          disabled={!value || isLoading} 
          onClick={handleBooking}
        >
          Book Visit
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;
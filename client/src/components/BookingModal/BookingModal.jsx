import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import UserDetailContext from "../../context/UserDetailContext.js";
import "@mantine/dates/styles.css";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { bookVisit } from "../../utils/api"; // Import bookVisit function

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
  const [value, setValue] = useState(null);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const token = userDetails?.token;

  const handleBooking = () => {
    if (!token) {
      toast.error("Please login to book a visit");
      return;
    }
    if (!value) {
      toast.error("Please select a date");
      return;
    }
    mutate();
  };

  const handleBookingSuccess = () => {
    toast.success("Visit booked successfully");
    setUserDetails((prev) => ({
      ...prev,
      bookings: [...(prev.bookings || []), { propertyId, date: value.toISOString() }]
    }));
    setOpened(false);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        return await bookVisit(propertyId, email, token, value);
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
          loading={isLoading}
        >
          Book Visit
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;
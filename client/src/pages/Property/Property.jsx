import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from "react-icons/ai";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import "./Property.css";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);

  useEffect(() => {
    const booking = bookings?.find((booking) => booking.propertyId === id);
    setIsBooked(!!booking);
    setBookingDate(booking ? new Date(booking.date).toLocaleDateString() : null);

    // Fetch booking status on component mount and after booking/cancellation
    const fetchBookingStatus = async () => {
      try {
        const response = await api.get(`/user/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsBooked(!!response.data);
        setBookingDate(response.data?.date ? new Date(response.data.date).toLocaleDateString() : null);
      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    fetchBookingStatus();
  }, [bookings, id, token]);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: async () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking.propertyId !== id),
      }));
      toast.success("Booking cancelled", { position: "bottom-right" });
    },
    onError: (error) => {
      toast.error("Error cancelling booking", { position: "bottom-right" });
      console.error("Cancel booking error:", error.response?.data || error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings"></div>
        <PuffLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* like Button */}
        <div className="like">
          <AiFillHeart size={24} color="white" />
        </div>
        <img src={data?.image} alt="home image" />

        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ color: "orange" }}>
                $ {data?.price}
              </span>
            </div>

            <div className="flexStart facilities">
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} Parking Garage</span>
              </div>
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} Bed Rooms</span>
              </div>
            </div>

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            <div
              className="flexStart"
              style={{ gap: "1rem", marginTop: "2rem" }}
            >
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {isBooked ? (
              <>
                <Button
                  variant="outline"
                  color="red"
                  style={{ width: "100%" }}
                  onClick={() => cancelBooking()}
                  loading={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit at this property is scheduled on {bookingDate}
                </span>
              </>
            ) : (
              <button
                className="flexCenter button"
                style={{ width: "100%", padding: "1rem" }}
                onClick={() => {
                  if (validateLogin()) {
                    setModalOpened(true);
                  }
                }}
              >
                Book Your Visit
              </button>
            )}
            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
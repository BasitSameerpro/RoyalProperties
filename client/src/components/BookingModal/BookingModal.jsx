import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import UserDetailContext from "../../context/UserDetailContext.js";
import "@mantine/dates/styles.css";
import { useMutation } from "react-query";

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
  const [value, setValue] = useState(null);
  // const { userDetail: {token}} = useContext(UserDetailContext);
  // console.log(token)
  const { mutate, isLoading } = useMutation({
    mutationFn: () => bookVisit(value, propertyId, email),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)} // Properly handle modal close
      title="Select your date to visit"
      centered
    >
      <div className="flexColCenter">
        <DatePicker value={value} onChange={setValue} minDate={new Date()} />
        <Button disabled={!value} onClick={() => mutate()}>
          Book Visit
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;

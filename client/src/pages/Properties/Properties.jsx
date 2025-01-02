import React from "react";
import "./Properties.css";
import useProperties from '../../hooks/useProperties'
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { PuffLoader } from "react-spinners";
const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }
  return (
    <div>
      <div className="wrapper">
        <div className="FlexColCenter paddings innerWidth properties-container">

          <div className="paddings flexCenter properties">
          {
          data.map((card, i) => (<PropertyCard card={card} key={i} />))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;

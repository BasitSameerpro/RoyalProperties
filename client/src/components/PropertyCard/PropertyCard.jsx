import React from "react";
import "./PropertyCard.css";
import {useNavigate} from 'react-router-dom'
import Heart from "../Heart/Heart";
const PropertyCard = ({ card }) => {

  const navigate = useNavigate();
  return (
    <div className="flexColStart r-card"
    onClick={()=>navigate(`../properties/${card.id}`)}
    >
        <Heart id={card?.id} />
      <img src={card.image} alt="home" />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.price}</span>
      </span>
      <span className="primaryText">{card.title}</span>
      <span className="secondaryText">{card.description}</span>
    </div>
  );
};

export default PropertyCard;

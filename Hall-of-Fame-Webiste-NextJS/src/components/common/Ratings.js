import React from "react";

const Ratings = ({ total, className}) => {
  return (
    <div className={`star-rating-area ${className}`}>
      <div className="rating-static clearfix" rel={total}>
        <label className="full" title="Awesome - 5 stars"></label>
        <label className="half" title="Pretty good - 4.5 stars"></label>
        <label className="full" title="Pretty good - 4 stars"></label>
        <label className="half" title="Meh - 3.5 stars"></label>
        <label className="full" title="Meh - 3 stars"></label>
        <label className="half" title="Kinda bad - 2.5 stars"></label>
        <label className="full" title="Kinda bad - 2 stars"></label>
        <label className="half" title="Meh - 1.5 stars"></label>
        <label className="full" title="Sucks big time - 1 star"></label>
        <label className="half" title="Sucks big time - 0.5 stars"></label>
      </div>
      <div className="ratilike ng-binding ml-1">({total})</div>
    </div>
  );
};

export default Ratings;

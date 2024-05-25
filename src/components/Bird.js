// Bird.js
import React from "react";
import owlImage from "../sprites/owl.gif";

const Bird = ({ birdPosition }) => {
    return (
        <img
            src={owlImage} // Use the imported image
            alt="bird"
            className="bird"
            style={{
                left: birdPosition.x,
                top: birdPosition.y,
            }}
            draggable={false}
        />
    );
};

export default Bird;

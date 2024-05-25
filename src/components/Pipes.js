import React from "react";
import pipeImage from "../sprites/pipe.png";

const Pipes = ({ pipePosition, isTopPipe }) => {
    return (
        <img
            src={pipeImage} // Use the imported image
            alt="pipe"
            className="pipe"
            style={{
                left: pipePosition.x,
                top: pipePosition.y,
                transform: isTopPipe ? 'rotate(180deg)' : 'none', // Rotate if isTopPipe is false
            }}
            draggable={false}
        />
    );
};

export default Pipes;

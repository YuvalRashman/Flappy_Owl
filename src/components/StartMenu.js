// src/components/StartMenu.js

import React from 'react';

const StartMenu = ({ topScores, bestScore, onStart }) => {
    return (
        <div className="start-menu">
            <h1>Flappy Owl</h1>
            <div className="leaderboard">
                <h2>Leaderboard</h2>
                <ul>
                    {topScores.map((entry, index) => ( // Changed the parameter name to 'entry'
                        <li key={index}>
                            {entry.name}: {entry.score} {/* Display name and score */}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="best-score">
                <h2>Your Best Score: {bestScore}</h2>
            </div>
            <button className="start-button" onClick={onStart}>Start Game</button>
        </div>
    );
};

export default StartMenu;

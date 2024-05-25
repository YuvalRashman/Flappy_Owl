import React, { useState, useEffect } from 'react';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import Score from './components/Score';
import StartMenu from './components/StartMenu.js'; // Import the StartMenu component
import './App.css';

const App = () => {
    const [birdPosition, setBirdPosition] = useState({ x: 50, y: 200 });
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [showStartMenu, setShowStartMenu] = useState(true); // State to handle the start menu
    const [topScores, setTopScores] = useState([
        { name: "Player 1", score: 50 },
        { name: "Player 2", score: 40 },
        { name: "Player 3", score: 30 },
        { name: "Player 4", score: 20 },
        { name: "Player 5", score: 10 },
    ]);
        const [bestScore, setBestScore] = useState(0); // Example best score

    const jump = () => {
        const jumpVelocity = -15;
        if (!gameOver && gameStarted) {
            setBirdVelocity(jumpVelocity); // Adjusted jump velocity
        } else if (!gameOver && !gameStarted) {
            // Start the game on the first jump
            setGameStarted(true);
            setBirdVelocity(jumpVelocity); // Adjusted jump velocity
        } else {
            // Restart the game
            restartGame();
        }
    };

    const restartGame = () => {
        setBirdPosition({ x: 50, y: 200 });
        setBirdVelocity(0); // Reset bird's velocity
        setPipes([]);
        setGameOver(false);
        setGameStarted(false);
        setScore(0); // Reset score
    };

    const checkCollision = () => {
        const birdTop = birdPosition.y;
        const birdBottom = birdPosition.y + 50;
        const birdLeft = birdPosition.x;
        const birdRight = birdPosition.x + 50;

        pipes.forEach((pipe) => {
            const topPipeBottom = pipe.topPipeY + 600;
            const bottomPipeTop = pipe.bottomPipeY;

            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + 100;

            const isColliding =
                birdRight > pipeLeft &&
                birdLeft < pipeRight &&
                (birdTop < topPipeBottom || birdBottom > bottomPipeTop);

            if (isColliding) {
                // Bird has hit the pipe, end the game
                setGameOver(true);
                setGameStarted(false);
            }
        });

        // Check if bird is out of the screen vertically
        if (birdBottom > 600 || birdTop < -170) {
            // Bird is out of bounds, end the game
            setGameOver(true);
            setGameStarted(false);
        }
    };

    const updateScore = () => {
        pipes.forEach((pipe, index) => {
            const pipeMiddle = pipe.x + 50;
            const birdRight = birdPosition.x + 50;

            if (birdRight > pipeMiddle && !pipe.scored) {
                setScore((prevScore) => {
                    const newScore = prevScore + 1;
                    return newScore;
                });              
                const newPipes = [...pipes];
                newPipes[index].scored = true; // Mark this pipe as scored
                setPipes(newPipes);
            }
        });
    };

    useEffect(() => {
        if (!gameOver) {
            checkCollision();
            updateScore();
        }
    }, [birdPosition, pipes, gameOver]);

    useEffect(() => {
        if (gameStarted) {
            const gravity = setInterval(() => {
                setBirdPosition((prev) => ({
                    ...prev,
                    y: Math.min(prev.y + birdVelocity, 650) // Limit bird's vertical movement
                }));
                setBirdVelocity((prevVelocity) => Math.min(prevVelocity + 2, 14)); // Update velocity based on the previous value
                checkCollision();
            }, 30);

            return () => {
                clearInterval(gravity);
            };
        }
    }, [birdVelocity, birdPosition, gameStarted, gameOver]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const pipeGenerator = setInterval(() => {
                const gapHeight = 150; // Define the height of the gap between the pipes
                const minPipeHeight = 50; // Define the minimum height for the pipes
                const maxPipeHeight = 400; // Define the maximum height for the pipes

                const randomHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight; // Generate a random height for the top pipe
                const topPipeY = randomHeight - 600; // Calculate the Y position of the top pipe
                const bottomPipeY = randomHeight + gapHeight; // Calculate the Y position of the bottom pipe

                setPipes((prev) => [
                    ...prev,
                    { x: 600, topPipeY, bottomPipeY, scored: false }, // Generate both top and bottom pipes with the correct positions
                ]);
            }, 2000);

            const pipeMove = setInterval(() => {
                setPipes((prev) =>
                    prev
                        .map((pipe) => ({ ...pipe, x: pipe.x - 5 }))
                        .filter((pipe) => pipe.x + 100 > 0) // Remove pipes that are out of frame
                );
            }, 30);

            return () => {
                clearInterval(pipeGenerator);
                clearInterval(pipeMove);
            };
        }
    }, [gameStarted, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [jump]);

    const handleStart = () => {
        setShowStartMenu(false);
        restartGame();
    };

    const handleReturnToMenu = () => {
        setShowStartMenu(true);
        setGameOver(false);
        setGameStarted(false);
    };

    return (
        <div
            className={`App ${gameOver ? 'game-over' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                if (!showStartMenu) {
                    jump();
                }
            }}
        >
            {showStartMenu ? (
                <StartMenu topScores={topScores} bestScore={bestScore} onStart={handleStart} />
            ) : (
                <>
                    <Bird birdPosition={birdPosition} />
                    <Score score={score} />
                    {pipes.map((pipe, index) => (
                        <React.Fragment key={index}>
                            <Pipes
                                pipePosition={{ x: pipe.x, y: pipe.topPipeY }}
                                isTopPipe={true} // Indicate it's a top pipe
                            />
                            <Pipes
                                pipePosition={{ x: pipe.x, y: pipe.bottomPipeY }}
                                isTopPipe={false} // Indicate it's a bottom pipe
                            />
                        </React.Fragment>
                    ))}
                    {gameOver && (
                        <center>
                            <div className="game-over-message">
                                Game Over!
                                <br />
                                <p style={{ backgroundColor: 'red', padding: "2px 6px", borderRadius: '5px' }}>Click anywhere to Restart</p>
                                <button onClick={handleReturnToMenu}>Return to Start Menu</button> {/* Button to return to start menu */}
                            </div>
                        </center>
                    )}
                </>
            )}
        </div>
    );
};

export default App;

import React, { useEffect, useRef, useState } from 'react';
import "./style.css";

const paragraph = `In today's fast-paced world, technology continues to reshape the way we live and work. From artificial intelligence and machine learning to cloud computing and blockchain, innovation is driving rapid advancements across industries. Businesses are leveraging these tools to improve efficiency, enhance customer experiences, and stay ahead of the competition.`;

const TypingTest = () => {

    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [mistakes, setMistakes] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [LPM, setLPM] = useState(0);
    const inputRef = useRef(null);
    const charRefs = useRef([]);
    const [correctWrong, setCorrectWrong] = useState([]);

    const handleChange = (e) => {
        const characters = charRefs.current;
        let typedChar = e.target.value.slice(-1);
        let currentChar = characters[charIndex].textContent;

        if (charIndex < characters.length && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true);
            }

            if (typedChar === currentChar) {
                setCorrectWrong((prev) => {
                    const updated = [...prev];
                    updated[charIndex] = "correct";
                    return updated;
                });
            } else {
                setMistakes(mistakes + 1);
                setCorrectWrong((prev) => {
                    const updated = [...prev];
                    updated[charIndex] = "wrong";
                    return updated;
                });
            }
            setCharIndex(charIndex + 1);

            if (charIndex === characters.length - 1) {
                setIsTyping(false);
            }
        } else {
            setIsTyping(false);
        }
    };

    const resetTest = () => {
        setTimeLeft(maxTime);
        setMistakes(0);
        setCharIndex(0);
        setCorrectWrong(Array(paragraph.length).fill(''));
        setIsTyping(false);
        setWPM(0);
        setLPM(0);
        inputRef.current.value = ""; // Clear the input
        inputRef.current.focus(); // Focus back on the input field
    };

    useEffect(() => {
        inputRef.current.focus();
        setCorrectWrong(Array(charRefs.current.length).fill(''));
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);

                let correctChars = charIndex - mistakes;
                let totalTime = maxTime - timeLeft;
                let lpm = correctChars * (60 / totalTime);
                lpm = lpm < 0 || !lpm || lpm === Infinity ? 0 : lpm;
                setLPM(parseInt(lpm, 10));

                let wpm = Math.round((correctChars / 5 / totalTime) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft, charIndex, mistakes]);

    return (
        <div className='container'>
            <div className="test">
                <input type="text" id="input" className='input-field' ref={inputRef} onChange={handleChange} />
                {
                    paragraph.split("").map((char, index) => (
                        <span key={index} className={`char ${index === charIndex ? "active" : ""} ${correctWrong[index]}`} ref={(e) => (charRefs.current[index] = e)}>
                            {char}
                        </span>
                    ))
                }
            </div>
            <div className="result">
                <p>Time Left: <strong>{timeLeft}</strong></p>
                <p>Mistakes: <strong>{mistakes}</strong></p>
                <p>WPM: <strong>{WPM}</strong></p>
                <p>LPM: <strong>{LPM}</strong></p>
                <button className='btn' onClick={resetTest}>Try Again</button>
            </div>
        </div>
    );
};

export default TypingTest;

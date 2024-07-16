import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizStarted] = useState(0); // 0: not started, 1: started
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerable, setIsAnswerable] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionTime, setQuestionTime] = useState(30); // 30 seconds for each question

  const initialTimeOutForQuestion = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let timer;
    if (quizState === 1) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

        setQuestionTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNextQuestion();
            return 30; // Reset for the next question
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, startTime, currentQuestionIndex]);

  const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    generateQuestions(data);
  };

  const generateQuestions = (posts) => {
    const generatedQuestions = Array.from({ length: 10 }, () => {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      return {
        question: generateQuestion(posts),
        options: generateOptions(randomPost.title, posts),
        answer: getRandomAnswer(),
      };
    });

    setQuestions(generatedQuestions);
  };

  const generateOptions = (correctAnswer, posts) => {
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      options.add(randomPost.title);
    }
    return Array.from(options).sort();
  };

  const generateQuestion = (posts) => {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    return randomPost.body + "?";
  };

  const getRandomAnswer = () => Math.floor(Math.random() * 4);

  const onStart = () => {
    setQuizStarted(1);
    setCurrentQuestionIndex(0);
    setIsAnswerable(false);
    setStartTime(Date.now());
    setTimeout(() => setIsAnswerable(true), initialTimeOutForQuestion);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerable(false);
      setQuestionTime(30);
      setTimeout(() => setIsAnswerable(true), initialTimeOutForQuestion);
    } else {
      // Handle quiz completion logic here
      setQuizStarted(2); // Finish the quiz
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative">
      {quizState === 0 && (
        <div>
          <h1 className="text-4xl font-bold mb-6">Quiz App</h1>
          <button
            className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            onClick={onStart}
          >
            Start Quiz
          </button>
        </div>
      )}
      {quizState === 1 && currentQuestion && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Question {currentQuestionIndex + 1} | Remaining Time: {questionTime}
            s
          </h2>
          <h3 className="text-lg mb-4">{currentQuestion.question}</h3>
          <div className="flex flex-col mb-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`mb-2 px-4 py-2 text-lg font-semibold text-white rounded-lg transition duration-300 ${
                  isAnswerable
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (isAnswerable) {
                    setQuestions(
                      questions.map((e, i) =>
                        i === currentQuestionIndex ? { ...e, answer: index } : e
                      )
                    );
                    handleNextQuestion();
                  }
                }}
                disabled={!isAnswerable}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {quizState === 2 && <div>Finished</div>}
      <div className="absolute top-4 left-4 text-xl font-bold">
        Total Time Elapsed: {elapsedTime} seconds
      </div>
    </div>
  );
};

export default App;

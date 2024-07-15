import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizStarted] = useState(0); // 0: not started, 1: started, 2: finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

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
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
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
            Question {currentQuestionIndex + 1}
          </h2>
          <h3 className="text-lg mb-4">{currentQuestion.question}</h3>
          <div className="flex flex-col">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="mb-2 px-4 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
                onClick={() => {
                  // Handle answer selection
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

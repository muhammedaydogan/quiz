import React, { useEffect, useState } from "react";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    setPosts(data);
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

  return (
    <div>
      <h1>Quiz App</h1>
      <button className="font-bold">Start Quiz</button>
    </div>
  );
};

export default App;

import './App.css';
import React, { useState } from 'react';
import NavBar from './components/NavBar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const App = () => {
  const pageSize = 5;
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <Router>
        <NavBar />
        <LoadingBar height={3} color="#f11946" progress={progress} />
        <Routes>
          <Route path="/" element={<News setProgress={setProgress} pageSize={pageSize} category="world" />} />
          <Route path="/world" element={<News setProgress={setProgress} pageSize={pageSize} category="world" />} />
          <Route path="/business" element={<News setProgress={setProgress} pageSize={pageSize} category="business" />} />
          <Route path="/culture" element={<News setProgress={setProgress} pageSize={pageSize} category="culture" />} />
          <Route path="/lifeandstyle" element={<News setProgress={setProgress} pageSize={pageSize} category="lifeandstyle" />} />
          <Route path="/science" element={<News setProgress={setProgress} pageSize={pageSize} category="science" />} />
          <Route path="/sport" element={<News setProgress={setProgress} pageSize={pageSize} category="sport" />} />
          <Route path="/technology" element={<News setProgress={setProgress} pageSize={pageSize} category="technology" />} />

          <Route path="*" element={<div style={{ textAlign: "center", marginTop: "100px" }}>404 - Page not found</div>} />
        </Routes>

      </Router>
    </div>
  );
};

export default App;

import './App.css';
import { useEffect } from 'react';
import { ARApp } from './complete/lecture3_11/app';

function App() {

  useEffect(() => {
    console.log("here")
    document.addEventListener("DOMContentLoaded", ()=>{
      const app = new ARApp();
      window.app = app;
      console.log(window.app)
  });
  },[]);

  return (
    <div className="App">
      <h1>Hello</h1>
        
    </div>
  );
}

export default App;

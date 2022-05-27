import './App.css';
import { useEffect } from 'react';
import { ARApp } from './complete/lecture7_3/app';

function App() {

  useEffect(() => {
    console.log("here")
      const app = new ARApp();
      window.app = app;
      console.log(window.app)
  },[]);

  return (
    <div className="App">
      <h1>Hello</h1>
       <button onClick={() => window.app.showChair(`./knight2.glb`)}>AR Button</button> 
    </div>
  );
}

export default App;

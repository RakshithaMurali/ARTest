import './App.css';
import { useEffect } from 'react';
import { ARApp } from './complete/lecture7_3/app';

function App() {

  useEffect(() => {
      const app = new ARApp();
      window.app = app;
  },[]);

  return (
    <div className="App">
      <h1>Hello</h1>
       <button onClick={() => window.app.showChair(`./untitled.glb`)}>AR Button</button> 
    </div>
  );
}

export default App;

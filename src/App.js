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
        <button onClick={() => window.app.showChair(`https://firebasestorage.googleapis.com/v0/b/arrange-eafdc.appspot.com/o/9Q4w8xdpUZ%2Funtitled.glb?alt=media&token=98a303d0-4897-4a80-a9ab-9edc1053f939`)}>AR Button</button> 
    </div>
  );
}

export default App;

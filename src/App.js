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
       <button onClick={() => window.app.showChair(`https://firebasestorage.googleapis.com/v0/b/arrange-eafdc.appspot.com/o/0wTemIueqT%2Fscene.glb?alt=media&token=141c1b57-21ad-4047-aef1-ce01accbffcd`)}>AR Button</button> 
    </div>
  );
}

export default App;

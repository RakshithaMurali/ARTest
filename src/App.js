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
       <button onClick={() => window.app.showChair(`https://firebasestorage.googleapis.com/v0/b/arrange-eafdc.appspot.com/o/2QyeMCcfSo%2Fscene.glb?alt=media&token=e41c5666-083a-4faf-b1ae-7241223c0875`)}>AR Button</button> 
    </div>
  );
}

export default App;

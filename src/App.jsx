import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Router from './Router';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App

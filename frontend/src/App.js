import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from './AppLayout';
import Home from './Pages/Home';

function App() {
  return (
<>
<BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} /> 
        </Route>
  </Routes>      
</BrowserRouter>
</>
  );
}

export default App;

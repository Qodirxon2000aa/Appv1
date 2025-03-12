import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/home/home';
import Dash from "./components/dashboard/dash";
import Personal from "./components/dashboard/personal/personal";
import Object from './components/dashboard/Object/object';
import WorkType from "./components/dashboard/WorkType/WorkType";
import View from "./components/view/order/order";
import Calcu from "./components/calcu/calcu";
import Money from "./components/money/money";
import Loading from "./components/Loading-animation/loading";

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // 0.5s loading effect
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loading />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/dashboard/personal" element={<Personal />} />
        <Route path="/dashboard/object" element={<Object />} />
        <Route path="/dashboard/worktype" element={<WorkType />} />
        <Route path="/view/order" element={<View />} />
        <Route path="/calcu" element={<Calcu />} />
        <Route path="/money" element={<Money />} />
      </Routes>
    </>
  );
}

export default App;
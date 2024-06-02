import React from 'react';
import Routes from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function App() {
   return (
       <>
        <Routes/>
        <ToastContainer/>
       </>
   );
}
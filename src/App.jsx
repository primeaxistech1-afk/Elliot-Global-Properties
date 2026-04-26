import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Home from "./pages/Home";
export default function App (){
  return(
    <BrowserRouter>
      <>
      <Nav />
      <Home />
      </>
      </BrowserRouter>
  )
}
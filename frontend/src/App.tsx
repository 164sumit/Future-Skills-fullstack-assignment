import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import Footer from './components/Footer'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={< HomePage />} />
      {/* <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
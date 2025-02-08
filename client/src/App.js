import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { SocketProvider } from './providers/socket'
import Home from './pages/Home'
import Room from './pages/Room'


const App = () => {
  return (
    <div>
        <SocketProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:roomId' element={<Room />} />
            <Route path='/contact' element={<h1>Contact</h1>} />
          </Routes>
        </SocketProvider>
    </div>
  )
}

export default App
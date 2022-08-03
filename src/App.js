import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import PrivateRoute from './components/PrivateRoute';
import Error404 from './components/Error404';
import Sidebar from './components/Sidebar'

import { AuthProvider } from './context/AuthContext.js'

import './css/styles.css';
import Topbar from './components/Topbar';

function App() {

  return (
    <AuthProvider>
      <div id="app-container">
        <BrowserRouter>
          <Topbar />
          <Sidebar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/chat" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

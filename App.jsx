import './style/App.css'
import NavBar from './components/NavBar.jsx'
import { Route, Routes } from 'react-router-dom'
import AddTask from './components/AddTask.jsx'
import List from './components/List.jsx'
import UpdateTask from './components/UpdateTask.jsx'
import SignUp from './components/SignUp.jsx'
import Login from './components/Login.jsx'

function App() {

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<List/>} />
        <Route path="/add" element={<AddTask/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/update/:id" element={<UpdateTask/>} />
      </Routes>
    </>
  )
}

export default App

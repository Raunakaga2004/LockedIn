import { Route, Routes } from 'react-router-dom'

// components
import Home from './Components/Home'
import SignIn from './Components/sign-in/SignIn'
import SignUp from './Components/sign-up/SignUp'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
    </Routes>
  )
}

export default App

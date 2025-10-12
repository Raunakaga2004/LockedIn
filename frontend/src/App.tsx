import { Route, Routes } from 'react-router-dom'

// components
import Home from './Components/Home'
import SignIn from './Components/sign-in/SignIn'
import SignUp from './Components/sign-up/SignUp'
import Pomodoro from './Components/Pomodoro'
import { ToastContainer } from 'react-toastify'
import AppTheme from './Components/shared-theme/AppTheme'
import CssBaseline from '@mui/material/CssBaseline'

import {RecoilRoot} from 'recoil'

function App() {

  return (<RecoilRoot>
  <AppTheme>
    <CssBaseline enableColorScheme />
    {/* <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={user}/> */}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/pomodoro' element={<Pomodoro/>}/>
    </Routes>

    <ToastContainer/>
    </AppTheme>
  </RecoilRoot>)
}

export default App

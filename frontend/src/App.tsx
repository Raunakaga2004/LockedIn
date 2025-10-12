import { Route, Routes } from 'react-router-dom'

// components
import Home from './Components/Home'
import SignIn from './Components/sign-in/SignIn'
import SignUp from './Components/sign-up/SignUp'
import { ToastContainer } from 'react-toastify'
import AppTheme from './Components/shared-theme/AppTheme'
import CssBaseline from '@mui/material/CssBaseline'

function App() {

  return (<>
  <AppTheme>
      <CssBaseline enableColorScheme />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      
    </Routes>

    <ToastContainer/>
    </AppTheme>
  </>)
}

export default App

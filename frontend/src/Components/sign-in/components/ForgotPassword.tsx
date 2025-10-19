import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios';
import { showError, showSuccess } from '../../../utils/toast';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setemail] = React.useState<string>("")

  const emailRef = React.useRef<HTMLInputElement>(null)
  const otpRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const [processing, setpro] = React.useState<boolean>(false)

  const [openOTP, setOpen]= React.useState<boolean>(false);

  const [openReset, setReset] = React.useState<boolean>(false)
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const validateInputs = () => {
    const password = passwordRef.current?.value;

    let isValid = true;

    if (!password || password.length < 6 || !passwordRegex.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long, must contain special character, must contain capital letter and small letter');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleForgotPassword = async ()=>{
    setpro(true);

    setemail(emailRef.current?.value || "");
    
    axios.post(`${import.meta.env.VITE_URL}/user/forgotPassword`, {
      email : emailRef.current?.value
    })
    .then(()=>{
      showSuccess("OTP sent successfully!")
      setpro(false)
      setOpen(true);
      // handleClose();

    })
    .catch((e) => {
      setOpen(false);
      setpro(false);
      showError("Invalid Email Address!")
      console.error(e)
    })
    
  }

  const handleOTP = async ()=>{
    console.log("hi" + email)

    axios.post(`${import.meta.env.VITE_URL}/user/otpVerification`, {
      email : email,
      otp : parseInt(otpRef.current?.value || '0')
    }).then(()=>{
      showSuccess("OTP verified successfully!")
      setOpen(false)
      setReset(true);
    }).catch((e) => {
      showError("Invalid OTP!")
      console.error(e)
    })
    
  }

  const handleNewPass = async ()=>{
    validateInputs()

    axios.post(`${import.meta.env.VITE_URL}/user/resetPassword`, {
      email : email,
      password : passwordRef.current?.value || ""
    }).then(()=>{
      showSuccess("Password Reset successfully!")
      setReset(false)
      handleClose()
    }).catch((e) => {
      showError("Invalid Passowrd!")
      console.error(e)
    })
    
  }

  const EmailWindow = ()=>{
    return <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleForgotPassword();
            },
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            {processing ? <>
              Sending OTP... Please don&apos;t close or refresh.
            </> : <>
              Enter your account&apos;s email address, and we&apos;ll send you a otp to
              reset your password.
            </>}
          </DialogContentText>
          {!processing && <OutlinedInput
            inputRef={emailRef}
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
          />}
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} disabled={processing}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={processing}>
            Continue
          </Button>
        </DialogActions>
      </Dialog> 
  }

  const OTPWindow = ()=>{
    return <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleOTP();
            },
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter OTP {"("}OTP is only valid for 10 mins{")"}
          </DialogContentText>
          <OutlinedInput
            inputRef={otpRef}
            autoFocus
            required
            margin="dense"
            id="otp"
            name="otp"
            label="OTP"
            placeholder="OTP"
            type="number"
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={()=>{
            setOpen(false);
            handleClose
            }}>Change email</Button>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
  }

  const ResetWindow = ()=>{
    return <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleNewPass()
            },
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter the new password
          </DialogContentText>

          <FormControl fullWidth required variant="outlined" error={!!passwordError}>
            {/* <InputLabel htmlFor="password">New Password</InputLabel> */}
            <OutlinedInput
              inputRef={passwordRef}
              autoFocus
              required
              margin="dense"
              id="pass"
              name="pass"
              label="pass"
              placeholder="new password"
              type="text"
              fullWidth
            />
            <FormHelperText>
              {passwordError ? passwordErrorMessage : 'Enter a strong password'}
            </FormHelperText>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={()=>{
            setReset(false);
            handleClose
            }}>Close</Button>
          <Button variant="contained" type="submit">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
  }

  return <>
    {openOTP ? <OTPWindow/> : openReset ? <ResetWindow/> : <EmailWindow/>}
    
  </>
}

// fix the background
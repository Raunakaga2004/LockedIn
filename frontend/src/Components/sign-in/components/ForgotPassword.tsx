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
import { waitForAllSettled } from 'recoil';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const emailRef = React.useRef<HTMLInputElement>(null)
  const otpRef = React.useRef<HTMLInputElement>(null)

  const [processing, setpro] = React.useState<boolean>(false)

  const [openOTP, setOpen]= React.useState<boolean>(false);

  const handleForgotPassword = async ()=>{
    setpro(true);
    
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
    axios.post(`${import.meta.env.VITE_URL}/user/otpVerification`, {
      email : emailRef.current?.value,
      otp : otpRef.current?.value
    })
    .then(()=>{
      showSuccess("OTP verified successfully!")

    })
    .catch((e) => {
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
            Enter OTP
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

  const RESETPASSWindow = ()=>{
    return <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              // handleOTP();
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
            Enter OTP
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

  return <>
    {openOTP ? <OTPWindow/> : <EmailWindow/>}
  </>
}


// add reset window 
// otp timer
// fix the background
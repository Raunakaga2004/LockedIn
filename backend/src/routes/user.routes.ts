import {Router} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// db config
import prisma from '../config/prisma';

// zod schemas
import { ForgotPasswordSchema, ResetPasswordSchema, SignInSchema, SignUpSchema, VerifyOTPSchema } from '../schemas/user.schema';

// zod validator
import { validateZod } from '../middlewares/validateZod';

// authorization middleware
import { verifyToken } from '../middlewares/verifyToken';
import generateOTP from '../utils/generateOTP';
import { sendEmail } from '../utils/emailService';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  // to get the user data
  try{
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where : { id : userId},
      select : {
        id : true,
        firstname : true,
        lastname : true,
        username : true,
        email : true,
        phone_number : true,
        created_At : true,
        updated_At : true
      }
    })

    return res.status(200).json({
      user : user
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/signup', validateZod(SignUpSchema), async (req, res) => {
  // for signup
  try{
    const {username, firstname, lastname, email, phone_number, password} = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email },
          { phone_number: phone_number },
        ],
      },
    });

    if(user){
      return res.status(400).json({
        error : "User Details Invalid!"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data : {
        username : username,
        firstname : firstname,
        lastname : lastname,
        email : email.toLowerCase(),
        phone_number : phone_number,
        password : hashedPassword
      }
    })

    return res.status(200).json({
      message : "User created successfully"
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/signin',validateZod(SignInSchema), async (req, res) => {
  // for signin
  try{
    const {username, email, phone_number, password} = req.body;

    const conditions = [
      username && {username},
      email && {email: email.toLowerCase()},
      phone_number && {phone_number}
    ].filter(Boolean)

    const user = await prisma.user.findFirst({
      where : {
        OR : conditions
      }
    })

    if(!user) return res.status(403).json({
      error : 'User not found!'
    })

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(403).json({
      error : 'Invalid password!'
    })

    if(!process.env.JWT_SECRET){
      return res.status(500);
    }

    const token = jwt.sign({
      userId : user.id
    }, process.env.JWT_SECRET, {
      expiresIn : "1d"
    })

    return res.status(200).cookie("token", token, {
      httpOnly: true,
      secure : true,
      sameSite : "none",
      path : '/'
    }).json({
      message : "Signin Successfull!",
      token : token
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/signout', (req, res) => {
  try{
    return res.status(200).clearCookie("token", {
      httpOnly: true,
      secure : true,
      sameSite : "none",
      path : '/'
    }).json({
      message : "Signout Successfull!"
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/forgotPassword', validateZod(ForgotPasswordSchema), async (req, res) => {
  //forgot password
  try{
    const {email} = req.body;

    const user = await prisma.user.findUnique({
      where : {
        email : email
      }
    })

    if(!user) return res.status(400).json({
      message : "User not found!"
    })

    const otp = generateOTP()

    await prisma.user.update({
      where : {
        email : email
      },
      data : {
        otp : otp,
        otp_expires : new Date(Date.now() + 10*60*1000) // 10 minutes
      }
    })

    await sendEmail(email, "Password rest OTP!", `Your OTP to reset password at LockedIN is : ${otp}`)

    return res.status(200).json({
      message : "OTP sent to your email!"
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/otpVerification', validateZod(VerifyOTPSchema), async (req, res)=>{
  // to verify the otp
  try{
    const {otp, email} = req.body;

    const user = await prisma.user.findUnique({
      where : {
        email : email
      }
    })

    if(!user) return res.status(400).json({
      message : "User not found!"
    })

    if(!user.otp_expires){
      return res.status(400).json({
        message : "OTP not found"
      })
    }

    if(Date.now() <= user.otp_expires.getTime() && user.otp === otp){
      return res.status(200).json({
        message : "User verified!"
      })
    }

    return res.status(401).json({
      message : "Invalid OTP!"
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

router.post('/resetPassword', validateZod(ResetPasswordSchema), async (req, res) => {
  // to reset the password
  try{
    const {password, email} = req.body;

    const user = await prisma.user.findUnique({
      where : {
        email : email
      }
    })

    if(!user){
      return res.status(400).json({
        message : "User not found!"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if(await bcrypt.compare(hashedPassword, user.password)){
      return res.status(409).json({
        message : "You cannot use previous password!"
      })
    }

    await prisma.user.update({
      where : {
        email : email
      }, data : {
        password : hashedPassword
      }
    })

    return res.status(200).json({
      message : "Password reset successfully!"
    })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      error : "Internal Server Error!"
    })
  }
})

export default router;
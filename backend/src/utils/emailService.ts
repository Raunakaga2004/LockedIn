import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service : 'Gmail',
  auth : {
    user  : process.env.EMAIL_USER,
    pass : process.env.EMAIL_PASS
  }
})

export const sendEmail = async (to : string, subject : string, text : string) => {
  try{
    await transporter.sendMail({
      from : process.env.EMAIL_USER,
      to : to,
      subject : subject,
      text : text
    })
  }
  catch(e){
    console.log("error sending email : ", e);
  }
}
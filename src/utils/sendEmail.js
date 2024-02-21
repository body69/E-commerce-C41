import nodemailer from "nodemailer"

const sendEmail =async ({from=process.env.EMAIL,to,subject,cc,text,html,attachments=[]}={})=>{

    const transporter = nodemailer.createTransport({
        service:"gmail",
        tls:true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: `"Route academy 👻" <${process.env.EMAIL}>`, // sender address
          to, // list of receivers
          subject, // Subject line
          cc,
          text, // plain text body
          html,
          attachments // html body
        });
             
        return info.rejected.length ?false:true
      
}

export default sendEmail


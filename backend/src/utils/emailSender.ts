import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import jade from 'jade';

function sendNewPasswordTokenToEmail(token: string, email: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  fs.readFile(path.resolve(__dirname, 'emailTamplate.html'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      const newPasswordURL = `${process.env.HAPPY_FRONT_WEB_URL}/redefine-password/${token}`;

      const html = data.replace('HAPPY_PASSWORD_URL', newPasswordURL);

      const msg = {
        to: email, // Change to your recipient
        from: 'evailson.barbosa@gmail.com', // Change to your verified sender
        subject: 'happy - Mudança de senha',
        text: `Olá! Para completar o processo de mudança de senha clique no botão a baixo ou copie o seguite link em seu navegador: ${newPasswordURL}`,
        html: html
      }

      sgMail.send(msg).then(() => {
        console.log({ message: 'Email sent', email });
        return { message: 'Email sent', email }
      }).catch((error) => {
        console.error(error)
        return error
      })
    }
  })


}

export default sendNewPasswordTokenToEmail
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const sendEMail = async (email, name, link, id) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "Gmail", // or use your own SMTP server details
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_SECRET,
      },
    });

    const mailOptions = {
      to: email,
      form: "codedev90@gmail.com",
      subject: "Verification Mail",
      html: `<html>
      <head>
        <title>
        </title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwOMOxbie_rZMLzGF_KJFQqcW3xmKC-rC1fw&usqp=CAU" rel="stylesheet">
        <style>
          .logo {
              position: absolute;
              width: 69px;
              height: 60px;
              left: 85px;
              top: 66px;
          }
          .logo-name {
              position: absolute;
              width: 147px;
              height: 23px;
              padding-top: 20px;
              left: 85px;
              top: 160px;
          }
          .desc {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 240px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 22px;
            line-height: 28px;
   
            color: #606060;
          }
          .btn {
            position: absolute;
            width: 153px;
            height: 37px;
            left: 97px;
            top: 427px;
   
            background: #B7D7F7;
            border-radius: 4px;
            border: none;
          }
          .btn-text {
            width: 153px;
            height: 16px;
            left: 97px;
            top: 437px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            text-transform: uppercase;
            text-decoration: none;
          }
          .welcome {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 527px;
            padding-top: 22px;
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 22px;
            line-height: 28px;
   
            color: #606060;
   
          }
          .footer {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 733px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 15px;
   
            color: #606060;
          }
  
          @media screen and (min-width: 1080px) {
              .logo {
                width: 53px;
                height: 46px;
              }
              .logo-name {
                width: 107px;
                height: 17px;
              }
              .desc {
                font-size: 19px;
              }
              .btn {
                width: 119px;
              }
              .btn-text {
                font-size: 12px;
              }
              .welcome {
                font-size: 20px;
              }
          }
        </style>
      </head>
   
      <body>
          
          <p class="desc">
             Hi ${name}, <br><br>
             We're happy you signed up for DoSomething. <br>
             To start exploring, please confirm your email address.
          </p>
          <button class="btn"><a href=${link} class="btn-text" style="color:#000000">VERIFY NOW</a></button>
          <p class="welcome">
            Welcome to Optimite!
          </p>
          <p class="footer">
           Did you receive this email without signing up? <a href="#link"> Click here</a> This link will expire in 24 hours.<br>
           if button does't work : ${link}
          </p>
          <p class="footer">
           
           Best regards,<br>
           Pramod Mahajan
          </p>
      </body>
    </html>
          `,
    };
    smtpTransport
      .sendMail(mailOptions)
      .then((response) => {
        console.log("Email Sent: ", response);
        return response;
      })
      .catch((error) => {
        console.error("Mail not Send : ", error);
      });
  } catch (err) {
    console.log(" Server error:", err);
  }
};

const dateToSendEMail = (email, name, title, date, setDate) => {
  try {
    console.log(date);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use your own SMTP server details
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_SECRET,
      },
    });

    // Define the email data
    const mailOptions = {
      from: "DoSomething",
      to: email,
      subject: `Task Reminder: ${title}`,
      html: `<html>
      <head>
        <title>
        </title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwOMOxbie_rZMLzGF_KJFQqcW3xmKC-rC1fw&usqp=CAU" rel="stylesheet">
        <style>
          .logo {
              position: absolute;
              width: 69px;
              height: 60px;
              left: 85px;
              top: 66px;
          }
          .logo-name {
              position: absolute;
              width: 147px;
              height: 23px;
              padding-top: 20px;
              left: 85px;
              top: 160px;
          }
          .desc {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 240px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 22px;
            line-height: 28px;
   
            color: #606060;
          }
          .btn {
            position: absolute;
            width: 153px;
            height: 37px;
            left: 97px;
            top: 427px;
   
            background: #B7D7F7;
            border-radius: 4px;
            border: none;
          }
          .btn-text {
            width: 153px;
            height: 16px;
            left: 97px;
            top: 437px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            text-transform: uppercase;
            text-decoration: none;
          }
          .welcome {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 527px;
            padding-top: 22px;
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 22px;
            line-height: 28px;
   
            color: #606060;
   
          }
          .footer {
            position: absolute;
            width: 711px;
            height: 143px;
            left: 97px;
            top: 733px;
   
            font-family: 'Sora';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 15px;
   
            color: #606060;
          }
  
          @media screen and (min-width: 1080px) {
              .logo {
                width: 53px;
                height: 46px;
              }
              .logo-name {
                width: 107px;
                height: 17px;
              }
              .desc {
                font-size: 19px;
              }
              .btn {
                width: 119px;
              }
              .btn-text {
                font-size: 12px;
              }
              .welcome {
                font-size: 20px;
              }
          }
        </style>
      </head>
   
      <body>
          
          <p class="desc">
             Dear ${name}, <br>
          </p>
          <p> This is a friendly reminder regarding the following task:</p>
          <p>Task : <b>${title}</b> </p>
          <p>Due Date : <b>${setDate}</b></p>
          <p>The task is scheduled to be completed by ${setDate}. Please make sure to allocate the necessary time and resources to complete it on time.</p>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to us.</p>
          
    
          <bclass="footer">
           Best Of Luck !

          </b>
      </body>
    </html>`,
    };

    schedule.scheduleJob(date, (error, response) => {
      // Send the email when the scheduled time is reached
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: " + info.response);
          return info.response;
        }
      });
      if (error) return 0;
      return;
    });
    return;
  } catch (err) {
    console.log(" Server error:", err);
  }
};
module.exports = {
  sendEMail,
  dateToSendEMail,
};

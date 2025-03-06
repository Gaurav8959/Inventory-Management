import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "gorav2553@gmail.com",
    pass: "umqw znwh qlih zuto",
  },
});

// const sendEmail = async () => {
//     try {
//         const info = await transporter.sendMail({
//             from: '"CodeByGaurav 👻" <gorav2553@gmail.com>', // sender address
//             to: "gorav2553@gmail.com,", // list of receivers
//             subject: "Hello ✔", // Subject line
//             text: "Hello world?", // plain text body
//             html: "<b>Ky lode land kl dekhe ge movie</b>", // html body
//           });
//           console.log(info);
//     } catch (error) {
//         console.log(error);
//     }
// }
// sendEmail();
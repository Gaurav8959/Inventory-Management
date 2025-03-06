import { transporter } from "./EmailConfig.js";
import { Verification_Email_Template,Welcome_Email_Template,Remainder_Email_Template } from "./EmailTemplate.js";

export const sendVerification = async (email, otp) => {
    try {
        const res = await transporter.sendMail({
            from: '"CodeByGaurav 👻" <gorav2553@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Otp for Verification", // Subject line
            text: "Welcome to CodeByGaurav", // plain text body
            html: Verification_Email_Template.replace("{otp}", otp), // html body
        });
        console.log("Email send Sucessfully", res);
    } catch (error) {
        console.log("email error");
    }
}

export const sendremainder = async (email, amnt) => {
    try {
        const res = await transporter.sendMail({
            from: '"Inventory Management" <gorav2553@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Payment Remainder", // Subject line
            text: "Welcome to inventory Management", // plain text body
            html: Verification_Email_Template.replace("{amnt}", amnt), // html body
        });
        console.log("Email send Sucessfully", res);
    } catch (error) {
        console.log("email error");
    }
}

export const welcomeEmail = async (email, name) => {
    try {
        const res = await transporter.sendMail({
            from: '"CodeByGaurav 👻" <gorav2553@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your account", // Subject line
            text: "Verify your Email", // plain text body
            html: Welcome_Email_Template.replace("{name}", name), // html body
        });
        console.log("Email send Sucessfully", res);
    } catch (error) {
        console.log("email error");
    }
}
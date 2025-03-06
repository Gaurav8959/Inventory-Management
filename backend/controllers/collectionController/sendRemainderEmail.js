import { transporter } from "../../middleware/EmailConfig.js"; // Import transporter
import { Remainder_Email_Template } from "../../middleware/EmailTemplate.js"; // Import email template

export const sendReminderEmail = async (email, amount) => {  // ⬅ Change function to accept email & amount directly
    if (!email || !amount) {
        console.error("Email and amount are required.");
        return false;
    }

    try {
        // Replace placeholders in the email template
        const emailContent = Remainder_Email_Template.replace("{amnt}", amount)
            .replace("${today}", new Date().toLocaleDateString());

        // Send email
        const info = await transporter.sendMail({
            from: '"Inventory Management" <gorav2553@gmail.com>',
            to: email,
            subject: "Payment Reminder",
            html: emailContent,
        });

        console.log(`✅ Email sent successfully to ${email}: ${info.messageId}`);
        return true; // Return true on success
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
        return false; // Return false on failure
    }
};

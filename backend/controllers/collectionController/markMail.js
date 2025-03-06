import cron from "node-cron";
import pool from "../../db/conn.js";
import { sendReminderEmail } from "./sendRemainderEmail.js";

const sendAutomaticEmails = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT 
    t.CSId,
    c.email,
    MAX(t.currentDate) AS latest_transaction_date,
    SUM(
        CASE 
            WHEN t.transactionType = 'credit' THEN -t.amount 
            WHEN t.transactionType = 'debit' THEN t.amount 
            ELSE 0 
        END
    ) AS pending_amount
FROM customers c
LEFT JOIN transactions t ON c.id = t.CSId
WHERE (t.collectionDate <= CURDATE() OR t.collectionDate IS NULL)
AND (t.emailSent = 0 OR t.emailSent IS NULL)
GROUP BY c.id, c.email
HAVING pending_amount > 0
ORDER BY latest_transaction_date DESC;`
    );

    for (let pending of rows) {
      console.log(`📧 Sending email to: ${pending.email}, Amount: ${pending.pending_amount}`);

      const emailSent = await sendReminderEmail(pending.email, pending.pending_amount); // ✅ Corrected function call

      if (emailSent) {
        await pool.query("UPDATE transactions SET emailSent = 1 WHERE CSId = ?", [pending.CSId]);
        console.log(`✅ Email sent successfully to ${pending.email}`);
      }
    }

    console.log("🎉 Email reminders sent successfully.");
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
};

// Run the job every day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("⏳ Running scheduled email job...");
  sendAutomaticEmails();
});

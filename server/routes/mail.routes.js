import express from "express";
import User from "../models/user.model.js";
import { extractUsername, generateEmailContent } from "../services/gemini.mail.service.js";
import { sendEmail } from "../services/mail.service.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    // Step 1 - Username detect karo
    const username = await extractUsername(transcript);
    console.log("Detected username:", username);

    // Step 2 - DB se user dhundo
    const recipient = await User.findOne({ username });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: `User "${username}" not found in database`,
      });
    }

    // Step 3 - Email content generate karo
    const emailContent = await generateEmailContent(transcript, username);
    console.log("Generated email content:", emailContent);

    // Step 4 - Email send karo
    await sendEmail({
      to: recipient.email,
      subject: emailContent.subject,
      html: emailContent.body,
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully ✅`,
      data: {
        recipient: username,
        email: recipient.email,
        subject: emailContent.subject,
      },
    });

  } catch (error) {
    console.error("Mail Route Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export default router;
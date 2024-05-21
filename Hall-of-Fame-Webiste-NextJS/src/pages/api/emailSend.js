import formData from "form-data";
import Mailgun from "mailgun.js";
import path from "path";
import ejs from "ejs";
import fs from "fs/promises";

const successTemplate = path.join(
  process.cwd(),
  "src",
  "templates",
  "email-verification.ejs"
);
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "postmaster@halloffame.world",
  key: "e137ccc5d106ebc9c58d38149994f4d9-1b3a03f6-29d23ee3",
});

export default async function handler(req, res) {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  if (req.method === "POST") {
    const { email, receiverName } = req.body;
    const template = await fs.readFile(successTemplate);
    const emailTemplate = ejs.render(template.toString(), {
      verificationCode: randomNumber,
      receiverName: receiverName,
      companyName: "halloffame",
    });
    // Create a new FormData object
    const formData = new FormData();

    // Append the form data

    formData.append("from", "no-reply@replies.mytechnology.ae");

    formData.append("to", email);

    formData.append("subject", "Verify Email Address");

    formData.append("text", randomNumber);

    const messageData = {
      from: "no-reply@replies.mytechnology.ae",

      to: email,

      subject: "Verify Email Address",

      text: randomNumber,

      html: emailTemplate,
    };
    client.messages
      .create("halloffame.world", messageData)
      .then((response) => {
        console.log(response);
        res.status(200).json({
          message: "Email sent successfully",
          code: randomNumber,
          status: 200,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
      });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}



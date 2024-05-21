import formData from "form-data";
import Mailgun from "mailgun.js";
import path from "path";
import ejs from "ejs";
import fs from "fs";

const successTemplate = path.join(
  process.cwd(),
  "src",
  "templates",
  "contact.ejs"
);

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "postmaster@halloffame.world",
  key: "e137ccc5d106ebc9c58d38149994f4d9-1b3a03f6-29d23ee3",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, subject, comment, footer_phone, footer_email } =
      req.body;

    console.log("req.body=============>", req.body);

    const template = await fs.readFileSync(successTemplate);

    const emailTemplate = ejs.render(template.toString(), {
      name: name,
      email: email,
      subject: subject,
      comment: comment,
      footer_email: footer_email,
      footer_phone: footer_phone,
    });
    // Create a new FormData object
    const formData = new FormData();

    // Append the form data
    formData.append("from", email);
    formData.append("to", "no-reply@replies.mytechnology.ae");
    formData.append("subject", "New Contact Request");

    const messageData = {
      from: email,
      to: "no-reply@replies.mytechnology.ae",
      subject: "New Contact Request",
      html: emailTemplate,
    };

    client.messages
      .create("halloffame.world", messageData)
      .then((response) => {
        console.log(response);
        res.status(200).json({ message: "Email sent successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
      });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

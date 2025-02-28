import { Resend } from "resend";

export default async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  console.log("data in sendEmail function",to);
  console.log("data in sendEmail function",subject);
  console.log("data in sendEmail function",react);

  try {
    let data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log("Error is sending Email");
    return { success: false, error: error.message };
  }
}

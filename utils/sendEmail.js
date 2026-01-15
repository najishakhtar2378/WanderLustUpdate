const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// transporter.verify((err, success) => {
//   if (err) {
//     console.log("❌ ERROR:", err);
//   } else {
//     console.log("✅ SMTP READY");
//   }
// });
module.exports.sendBookingEmail = async ({ to, listing, checkIn, checkOut }) => {
  const mailOptions = {
    from: `"WanderNest" <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ Booking Confirmed | WanderNest",
    html: `
      <h2>Booking Confirmed 🎉</h2>
      <p>Your booking has been successfully confirmed.</p>
      <hr/>
      <p><b>Listing:</b> ${listing.title}</p>
      <p><b>Location:</b> ${listing.location}, ${listing.country}</p>
      <p><b>Check-in:</b> ${checkIn}</p>
      <p><b>Check-out:</b> ${checkOut}</p>
      <br/>
      <p>Thank you for booking with <b>WanderNest</b> ❤️</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

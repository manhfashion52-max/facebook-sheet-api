const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SPREADSHEET_ID = "1VYnPlPVR1W8vYFN0acUY1Ky3DCj8TFLAEod2ZBoa_wM";
const SHEET_NAME = "DonHang";

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server OK" });
});

app.get("/test", async (req, res) => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toLocaleString("vi-VN"), "Test", "OK"]],
      },
    });

    res.json({ success: true, message: "Đã ghi Google Sheet" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

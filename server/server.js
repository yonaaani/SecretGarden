import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import multer from "multer";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

app.post("/api/predict", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(
      "https://interthronging-spectrologically-penni.ngrok-free.dev/api/Flower/predict",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ NGROK ERROR:", text);
      return res.status(500).json({ error: "ML API failed" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(5000, () =>
  console.log("🚀 Proxy server running on http://localhost:5000")
);

app.get("/api/flower/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(
      `https://interthronging-spectrologically-penni.ngrok-free.dev/api/Flower/${id}`
    );

    if (!response.ok) {
      const text = await response.text(); // дебаг
      console.error("❌ Flower API returned non-JSON:", text);
      return res.status(500).json({ error: "Flower API failed", details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Flower details proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
});


app.post("/api/User", upload.single("Image"), async (req, res) => {
  try {
    const formData = new FormData();

    formData.append("Image", req.file?.buffer, {
      filename: req.file?.originalname || "avatar.png",
      contentType: req.file?.mimetype || "image/png",
    });

    formData.append("Name", req.body.Name);
    formData.append("Email", req.body.Email);
    formData.append("Password", req.body.Password);

    const response = await fetch(
      "https://interthronging-spectrologically-penni.ngrok-free.dev/api/User",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    const text = await response.text();

    // ⚠️ навіть якщо 200 — API може повернути isSuccess=false
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid response from API", text });
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error("❌ Register proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
});


app.post("/api/User/Login", upload.none(), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("Email", req.body.Email);
    formData.append("Password", req.body.Password);

    const response = await fetch(
      "https://interthronging-spectrologically-penni.ngrok-free.dev/api/User/Login",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    const text = await response.text();

    // парсимо JSON відповідь
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid response from API", text });
    }

    // повертаємо відповідь клієнту
    res.status(response.status).json(data);

  } catch (err) {
    console.error("❌ Login proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
});

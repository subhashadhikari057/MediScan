import axios from "axios";

const API_KEY = "Bb-d3bab732d0d0c4ac284ad9e027621a9d"; // Replace with your key

export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      formData
    );
    return res.data.data.url; // public image URL
  } catch (err) {
    console.error("ImgBB upload failed:", err);
    throw err;
  }
};

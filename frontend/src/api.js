import axios from "axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:5001/upload", formData);

  // Convert structured object into array of { label, value }
  const structuredArray = Object.entries(res.data.structured || {}).map(
    ([key, value]) => ({ label: key, value })
  );

  return structuredArray;
};
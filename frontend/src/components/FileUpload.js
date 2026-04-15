import React from "react";

export default function FileUpload({ onFileSelect }) {
  return (
    <input
      type="file"
      onChange={(e) => onFileSelect(e.target.files[0])}
    />
  );
}
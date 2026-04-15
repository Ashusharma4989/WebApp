import React, { useState } from "react";

// ✅ Default imports, no curly braces
import FileUpload from "./components/FileUpload";
import EditableTable from "./components/EditableTable";
import CanvasEditor from "./components/CanvasEditor";

import { uploadFile } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImageUrl(url);

    const data = await uploadFile(selectedFile);
    setTableData(data);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <FileUpload onFileSelect={handleFileSelect} />
        {imageUrl && <CanvasEditor imageUrl={imageUrl} data={tableData} />}
      </div>
      <div style={{ width: "50%" }}>
        <EditableTable data={tableData} setData={setTableData} />
      </div>
    </div>
  );
}

export default App;
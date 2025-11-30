import React, { useState } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { Form, SimpleItem, Label } from "devextreme-react/form";
import { toast } from "react-toastify";

export default function ImportPopup({ visible, onHiding, handleImportFile, templateUrl }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast.error("Vui lòng chọn file để import");
      return;
    }
    handleImportFile(file);
    setFile(null);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onHiding}
      showTitle
      title="Import Excel"
      width={450}
      height="auto"
      dragEnabled={false}
      closeOnOutsideClick={false}
    >
      <div className="popup-container" style={{ padding: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <Button
            text="Tải file mẫu"
            type="default"
            stylingMode="contained"
            onClick={() => window.open(templateUrl, "_blank")}
          />
        </div>

        <Form labelLocation="top" colCount={1}>
          <SimpleItem>
            <Label text="Chọn file Excel" />
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </SimpleItem>
        </Form>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
          <Button text="Hủy" onClick={onHiding} stylingMode="outlined" />
          <Button text="Import" onClick={handleSubmit} type="success" />
        </div>
      </div>
    </Popup>
  );
}

import React from "react";
import { saveAs } from "file-saver";

interface DownloadButtonProps {
  csvContent: string;
  filename?: string;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  csvContent,
  filename = "labeling.csv",
  disabled = false,
}) => {
  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "#fff",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "12px 0"

    }}>
      <button onClick={handleDownload} disabled={disabled || !csvContent}>

        Baixar CSV {disabled ? "(Nenhum dado para baixar)" : ""}
      </button>
    </div>
  );
};

export default DownloadButton;
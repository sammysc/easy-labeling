 import React from "react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelected(event.target.files[0]);
    }
  };

  return (
    <div>
      <label htmlFor="csv-upload">
        Selecione um arquivo CSV:
        <input
          id="csv-upload"
          type="file"
          accept=".csv,text/csv"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
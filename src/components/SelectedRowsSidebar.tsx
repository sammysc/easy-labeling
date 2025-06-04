import React from "react";
import { CsvRow } from "../utils/csvUtils";
import DownloadButton from "./DownloadButton";
import { toCsv } from "../utils/csvUtils";

interface SelectedRowsSidebarProps {
  selectedRows: CsvRow[];
  onRemoveRow: (idx: number) => void;
  onClose: () => void;
  open: boolean;
}

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "auto",
  height: "100%",
  background: "#fff",
  boxShadow: "-2px 0 8px rgba(0,0,0,0.08)",
  zIndex: 2000,
  padding: "24px 16px",
  overflowY: "auto",
  transition: "transform 0.3s",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.15)",
  zIndex: 1999,
};

const SelectedRowsSidebar: React.FC<SelectedRowsSidebarProps> = ({
  selectedRows,
  onRemoveRow,
  onClose,
  open,
}) => {
  if (!open) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={sidebarStyle}>
        <button onClick={onClose} style={{ float: "right" }}>Fechar</button>
        <h3>Linhas selecionadas</h3>
        <div style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto", marginBottom: "16px" }}>
          {selectedRows.length === 0 ? (
            <div>Nenhuma linha selecionada ainda.</div>
          ) : (
            <table style={{ fontSize: "0.9em" }}>
              <thead>
                <tr>
                  {Object.keys(selectedRows[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Remover</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(row).map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                    <td>
                      <button onClick={() => onRemoveRow(idx)}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ position: "sticky", bottom: 0, background: "#fff", paddingTop: "8px" }}>
          <DownloadButton
            csvContent={toCsv(selectedRows)}
            disabled={selectedRows.length === 0}
          />
        </div>
      </div>
    </>
  );
};

export default SelectedRowsSidebar;
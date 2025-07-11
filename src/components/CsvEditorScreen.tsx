import React, { useState, useMemo } from "react";
import FileUpload from "./FileUpload";
import DownloadButton from "./DownloadButton";
import { CsvRow, parseCsv, toCsv } from "../utils/csvUtils";

// Copie estas constantes do SelectedRowsSidebar para manter igual
const LABEL_OPTIONS = [
  "app", "app.cip", "app.cip.process", "app.cip.process.medium", "app.cip.process.medium.cv",
  // ... (adicione todas as opções que já existem no SelectedRowsSidebar)
  "system.step.active.name",
];

const getLabelCategories = (labels: string[]) => {
  const categories: { [cat: string]: string[] } = {};
  labels.forEach(label => {
    const [cat] = label.split(".");
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(label);
  });
  return categories;
};

interface CsvEditorScreenProps {
  onBack: () => void;
}

const CsvEditorScreen: React.FC<CsvEditorScreenProps> = ({ onBack }) => {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [labelSearch, setLabelSearch] = useState<{ [idx: number]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<{ [idx: number]: string }>({});
  // Estado para labels editáveis por linha
  const [labels, setLabels] = useState<{ [idx: number]: string[] }>({});

  const labelCategories = useMemo(() => getLabelCategories(LABEL_OPTIONS), []);

  const handleFileSelected = async (file: File) => {
    const data = await parseCsv(file);
    setRows(data);
    setCsvLoaded(true);

    // Inicializa labels se coluna existir
    const labelCol = getLabelColumn(data[0]);
    if (labelCol) {
      setLabels(
        Object.fromEntries(
          data.map((row, idx) => [
            idx,
            (row[labelCol] || "").split(",").map(l => l.trim()).filter(Boolean)
          ])
        )
      );
    } else {
      setLabels({});
    }
  };

  const handleFieldChange = (rowIdx: number, field: string, value: string) => {
    setRows(prev =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, [field]: value } : row
      )
    );
  };

  // Helpers para Labels
  const handleLabelSearchChange = (idx: number, value: string) => {
    setLabelSearch(prev => ({
      ...prev,
      [idx]: value
    }));
  };

  const handleCategoryChange = (idx: number, value: string) => {
    setSelectedCategory(prev => ({
      ...prev,
      [idx]: value
    }));
    setLabelSearch(prev => ({
      ...prev,
      [idx]: ""
    }));
  };

  const handleSelectChange = (idx: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setLabels(prev => ({
      ...prev,
      [idx]: selected
    }));
    // Atualiza também a coluna no CSV
    setRows(prev =>
      prev.map((row, i) =>
        i === idx ? { ...row, [getLabelColumn(row) || "Labels"]: selected.join(",") } : row
      )
    );
  };

  const handleRemoveLabel = (idx: number, label: string) => {
    setLabels(prev => {
      const newLabels = (prev[idx] || []).filter(l => l !== label);
      // Atualiza também a coluna no CSV
      setRows(rows =>
        rows.map((row, i) =>
          i === idx ? { ...row, [getLabelColumn(row) || "Labels"]: newLabels.join(",") } : row
        )
      );
      return { ...prev, [idx]: newLabels };
    });
  };

  // Detecta a coluna de labels (Labels ou labels)
  function getLabelColumn(row: CsvRow | undefined): string | undefined {
    if (!row) return undefined;
    if ("Labels" in row) return "Labels";
    if ("labels" in row) return "labels";
    return undefined;
  }

  const labelCol = getLabelColumn(rows[0]);

  return (
    <div className="container">
      <h1>Modificar um Labeling</h1>
      <button onClick={onBack}>Voltar</button>
      <FileUpload onFileSelected={handleFileSelected} />
      {csvLoaded && rows.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ fontSize: "0.95em", marginTop: 24 }}>
            <thead>
              <tr>
                {Object.keys(rows[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(row).map(header => {
                    if (labelCol && header === labelCol) {
                      // Renderiza a interface de edição de labels
                      const category = selectedCategory[idx] || "";
                      const search = (labelSearch[idx] || "").toLowerCase();
                      let filteredOptions = LABEL_OPTIONS.filter(option =>
                        option.toLowerCase().includes(search)
                      );
                      if (category) {
                        filteredOptions = filteredOptions.filter(option => option.startsWith(category + "."));
                      }
                      return (
                        <td key={header}>
                          <div>
                            <input
                              type="text"
                              placeholder="Buscar label..."
                              value={labelSearch[idx] || ""}
                              onChange={e => handleLabelSearchChange(idx, e.target.value)}
                              style={{ width: "96%", marginBottom: 4 }}
                            />
                            <select
                              value={category}
                              onChange={e => handleCategoryChange(idx, e.target.value)}
                              style={{ marginBottom: 4, width: "100%" }}
                            >
                              <option value="">Todas as categorias</option>
                              {Object.keys(labelCategories).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <select
                              multiple
                              value={labels[idx] || []}
                              onChange={e => handleSelectChange(idx, e)}
                              style={{ minWidth: 120, minHeight: 60, width: "100%" }}
                            >
                              {filteredOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          <div style={{
                            minHeight: 24,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            padding: "2px 6px",
                            background: "#f8f8f8",
                            marginTop: 4,
                            fontSize: "0.95em"
                          }}>
                            {(labels[idx] || []).length === 0
                              ? <span style={{ color: "#aaa" }}>Nenhuma label selecionada</span>
                              : (labels[idx] || []).map(l => (
                                <span key={l} style={{
                                  display: "inline-block",
                                  background: "#e3f2fd",
                                  color: "#2980d9",
                                  borderRadius: 3,
                                  padding: "2px 6px",
                                  marginRight: 4,
                                  marginBottom: 2,
                                  position: "relative"
                                }}>
                                  {l}
                                  <button
                                    onClick={() => handleRemoveLabel(idx, l)}
                                    style={{
                                      marginLeft: 6,
                                      background: "transparent",
                                      border: "none",
                                      color: "#c0392b",
                                      cursor: "pointer",
                                      fontWeight: "bold",
                                      fontSize: "1em",
                                      lineHeight: "1em"
                                    }}
                                    title="Remover label"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            }
                          </div>
                        </td>
                      );
                    }
                    // Renderiza input normal para outras colunas
                    return (
                      <td key={header}>
                        <input
                          type="text"
                          value={row[header]}
                          onChange={e => handleFieldChange(idx, header, e.target.value)}
                          style={{ width: "auto" }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <DownloadButton
            csvContent={toCsv(rows)}
            filename="labeling_editado.csv"
            disabled={rows.length === 0}
          />
        </div>
      )}
    </div>
  );
};

export default CsvEditorScreen;
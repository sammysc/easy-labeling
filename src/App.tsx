import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SearchBar from "./components/SearchBar";
import ResultsTable from "./components/ResultsTable";
import SearchTipsModal from "./components/SearchTipsModal";
import SelectedRowsSidebar from "./components/SelectedRowsSidebar";
import ColumnFilters from "./components/ColumnFilters";
import { parseCsv, filterCsvRows, toCsv, CsvRow } from "./utils/csvUtils";
import { translationDictionary } from "./utils/translations";
import "./App.css";

const App: React.FC = () => {
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<CsvRow[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [csvLoaded, setCsvLoaded] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<CsvRow[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const [autoLabelingLoading, setAutoLabelingLoading] = useState(false);
  const [autoLabelingMessage, setAutoLabelingMessage] = useState<string | null>(null);

  // Função para aplicar todos os filtros
  const applyFilters = (
    rows: CsvRow[],
    keyword: string,
    filters: { [key: string]: string }
  ) => {
    let filtered = filterCsvRows(rows, keyword);
    Object.entries(filters).forEach(([col, val]) => {
      if (val) {
        filtered = filtered.filter(row => row[col] === val);
      }
    });
    return filtered;
  };

  const handleFileSelected = async (file: File) => {
    try {
      const rows = await parseCsv(file);
      setCsvRows(rows);
      setFilteredRows(rows);
      setCsvLoaded(true);
      setKeyword("");
      setColumnFilters({});
      setSelectedRows([]);
      setSelectedRows([]);
      setAutoLabelingMessage(null);
    } catch (error) {
      alert("Erro ao ler o arquivo CSV.");
      setCsvLoaded(false);
    }
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setFilteredRows(applyFilters(csvRows, value, columnFilters));
  };

  const handleColumnFilterChange = (col: string, value: string) => {
    const newFilters = { ...columnFilters, [col]: value };
    setColumnFilters(newFilters);
    setFilteredRows(applyFilters(csvRows, keyword, newFilters));
  };

  const handleSelectRows = (rows: CsvRow[]) => {
    setSelectedRows((prev) => {
      const keys = (row: CsvRow) => JSON.stringify(row);
      const allRows = [...prev, ...rows];
      const uniqueRows = Array.from(new Map(allRows.map(r => [keys(r), r])).values());
      return uniqueRows;
    });
  };

  const handleRemoveSelectedRow = (idx: number) => {
    setSelectedRows(prev => prev.filter((_, i) => i !== idx));
  };
  // Função para auto "rotulagem" baseada no dicionário de traduções
  const handleAutoLabeling = async () => {
    setAutoLabelingLoading(true);
    setAutoLabelingMessage(null);

    // Permite mostrar o loading na UI antes de processar
    await new Promise(resolve => setTimeout(resolve, 100));

    const allKeywords = Object.keys(translationDictionary).flatMap(pt =>
      [pt, ...translationDictionary[pt]]
    );

    const autoLabeledRows = csvRows.filter(row =>
      Object.values(row).some(value =>
        allKeywords.some(kw =>
          value && value.toLowerCase().includes(kw.toLowerCase())
        )
      )
    );

    setAutoLabelingLoading(false);

    if (autoLabeledRows.length === 0) {
      setAutoLabelingMessage("Nenhuma linha correspondente encontrada para Auto Labeling.");
      return;
    }

    setSelectedRows(prev => {
      const keys = (row: CsvRow) => JSON.stringify(row);
      const allRows = [...prev, ...autoLabeledRows];
      const uniqueRows = Array.from(new Map(allRows.map(r => [keys(r), r])).values());
      return uniqueRows;
    });

    setAutoLabelingMessage(`Auto Labeling concluído! ${autoLabeledRows.length} linha(s) adicionada(s) à seleção.`);


    // Adiciona as linhas encontradas aos selecionados (sem duplicar)
    setSelectedRows(prev => {
      const keys = (row: CsvRow) => JSON.stringify(row);
      const allRows = [...prev, ...autoLabeledRows];
      const uniqueRows = Array.from(new Map(allRows.map(r => [keys(r), r])).values());
      return uniqueRows;
    });
  };


  // Verifica se há linhas filtradas para exibir os cabeçalhos
  const csvHeaders = filteredRows.length > 0 ? Object.keys(filteredRows[0]) : [];
  const filterableColumns = csvHeaders.filter(h => h === "dataType");

  const handleClearAll = () => {
    setKeyword("");
    setColumnFilters({});
    setFilteredRows(csvRows);
    setSelectedRows([]);
  };

  return (

    <div className="container">
      <h1>Easy Labeling</h1>

      <button style={{ float: "right", marginTop: -48 }} onClick={() => setShowTips(true)}>
        Dicas de Pesquisa
      </button>
      <button style={{ float: "right", marginTop: -48, marginRight: 190 }} onClick={() => setSidebarOpen(true)}>
        Ver selecionados
      </button>
      <SearchTipsModal open={showTips} onClose={() => setShowTips(false)} />
      <SelectedRowsSidebar
        selectedRows={selectedRows}
        onRemoveRow={handleRemoveSelectedRow}
        onClose={() => setSidebarOpen(false)}
        open={sidebarOpen}
      />
      <FileUpload onFileSelected={handleFileSelected} />
      {csvLoaded && (
        <button
          style={{ marginBottom: 16, marginLeft: 8 }}
          onClick={handleAutoLabeling}
          disabled={autoLabelingLoading}
        >
          {autoLabelingLoading ? "Auto Labeling em andamento..." : "Auto Labeling"}
        </button>
      )}
      {autoLabelingMessage && (
        <div style={{ margin: "12px 0", color: "#2980d9", fontWeight: 500 }}>
          {autoLabelingMessage}
        </div>
      )}
      {csvLoaded && (
        <>
          <SearchBar keyword={keyword} onKeywordChange={handleKeywordChange} />
          {filteredRows.length > 0 && (
            <ColumnFilters
              headers={filterableColumns}
              rows={csvRows}
              filters={columnFilters}
              onFilterChange={handleColumnFilterChange}
            />
          )}
          {csvLoaded && (
            <button
              style={{ marginBottom: 16, marginLeft: 8, background: "#e74c3c" }}
              onClick={handleClearAll}
            >
              Limpar tudo
            </button>
          )}
          <ResultsTable
            rows={filteredRows}
            onSelectRows={handleSelectRows}
            selectedRows={selectedRows}
          />
        </>
      )}
    </div>
  );
};

export default App;
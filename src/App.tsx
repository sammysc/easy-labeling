import React, { useState, useRef, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import SearchBar from "./components/SearchBar";
import ResultsTable from "./components/ResultsTable";
import SearchTipsModal from "./components/SearchTipsModal";
import SelectedRowsSidebar from "./components/SelectedRowsSidebar";
import ColumnFilters from "./components/ColumnFilters";
import CsvEditorScreen from "./components/CsvEditorScreen";
import { parseCsv, filterCsvRows, toCsv, CsvRow } from "./utils/csvUtils";
import { translationDictionary } from "./utils/translations";
import "./App.css";

const App: React.FC = () => {
 
  const [screen, setScreen] = useState<"welcome" | "labeling" | "edit">("welcome");
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
  const [toast, setToast] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

 
  const LoadingBar: React.FC<{ text?: string }> = ({ text }) => (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: 4,
      background: "linear-gradient(90deg, #2980d9 30%, #6dd5fa 100%)",
      zIndex: 4000, animation: "loading-bar 1.2s linear infinite"
    }}>
      <style>
        {`
        @keyframes loading-bar {
          0% { width: 0vw; }
          100% { width: 100vw; }
        }
      `}
      </style>
      {text && (
        <div style={{
          position: "fixed", top: 8, left: "50%", transform: "translateX(-50%)",
          color: "#2980d9", fontWeight: 600, background: "#fff",
          padding: "4px 18px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          zIndex: 4001
        }}>
          {text}
        </div>
      )}
    </div>
  );

  
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
    setUploadLoading(true);
    try {
      const rows = await parseCsv(file);
      setCsvRows(rows);
      setFilteredRows(rows);
      setCsvLoaded(true);
      setKeyword("");
      setColumnFilters({});
      setSelectedRows([]);
      setAutoLabelingMessage(null);
      setScreen("labeling"); 
    } catch (error) {
      alert("Erro ao ler o arquivo CSV.");
      setCsvLoaded(false);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setFilteredRows(applyFilters(csvRows, value, columnFilters));
    }, 500);
  };

  const handleColumnFilterChange = (col: string, value: string) => {
    const newFilters = { ...columnFilters, [col]: value };
    setColumnFilters(newFilters);
    setFilteredRows(applyFilters(csvRows, keyword, newFilters));
  };

  const handleSelectRows = (rowsToSelect: CsvRow[]) => { 
    setSelectedRows((prev) => {
      const keys = (row: CsvRow) => JSON.stringify(row);
      const allRows = [...prev, ...rowsToSelect];
      const uniqueRows = Array.from(new Map(allRows.map(r => [keys(r), r])).values());
      const addedCount = uniqueRows.length - prev.length;
      if (addedCount > 0) {
        setToast(`${addedCount} linha(s) adicionada(s) à seleção!`);
        setTimeout(() => setToast(null), 2500);
      }
      return uniqueRows;
    });
  };

  const handleRemoveSelectedRow = (idx: number) => {
    setSelectedRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAutoLabeling = async () => {
    setAutoLabelingLoading(true);
    setAutoLabelingMessage(null);

    await new Promise(resolve => setTimeout(resolve, 100));

    const allKeywords = Object.keys(translationDictionary).flatMap(pt =>
      [pt, ...translationDictionary[pt]]
    );

    const autoLabeledRows = csvRows.filter(row =>
      Object.values(row).some(value =>
        allKeywords.some(kw =>
          value && typeof value === 'string' && value.toLowerCase().includes(kw.toLowerCase())
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
  };

  const handleClearAll = () => {
    setKeyword("");
    setColumnFilters({});
    setFilteredRows(csvRows);
    setSelectedRows([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setShowTips(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 
  const csvHeaders = csvLoaded && filteredRows.length > 0 ? Object.keys(filteredRows[0]) : [];
  const filterableColumns = csvHeaders.filter(h => h === "dataType");

  return (
    <>
      
      {(uploadLoading || autoLabelingLoading) && (
        <LoadingBar text={uploadLoading ? "Carregando arquivo..." : "Executando Auto Labeling..."} />
      )}

      
      {toast && (
        <div
          style={{
            position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
            background: "#2980d9", color: "#fff", padding: "12px 32px", borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 3000, fontSize: "1.1em",
            fontWeight: 500, pointerEvents: "none"
          }}
        >
          {toast}
        </div>
      )}

      {screen === "welcome" && (
        <div className="container" style={{ textAlign: "center", marginTop: 80 }}>
          <h1>Easy Labeling</h1>
          <p>Bem-vindo! O que você deseja fazer?</p>
          <button
            style={{ margin: 16, minWidth: 220 }}
            onClick={() => setScreen("labeling")}
          >
            Iniciar um Labeling
          </button>
          <button
            style={{ margin: 16, minWidth: 220 }}
            onClick={() => setScreen("edit")}
          >
            Modificar um Labeling
          </button>
        </div>
      )}

      {screen === "edit" && (
        <CsvEditorScreen onBack={() => setScreen("welcome")} />
      )}

      {screen === "labeling" && (
        <div className="container">
          <h1>Easy Labeling</h1>

          <button style={{ float: "right", marginTop: -48, marginRight: 0 }} onClick={() => setScreen("welcome")}>
            Voltar
          </button>
          <button style={{ float: "right", marginTop: -48, marginRight: 100 }} onClick={() => setShowTips(true)}>
            Dicas de Pesquisa
          </button>
          <button
            style={{ float: "right", marginTop: -48, marginRight: 295, position: "relative" }}
            onClick={() => setSidebarOpen(true)}
          >
            Ver selecionados
            {selectedRows.length > 0 && (
              <span
                style={{
                  background: "#2980d9", color: "#fff", borderRadius: "50%",
                  padding: "2px 8px", fontSize: "0.95em", fontWeight: 600, marginLeft: 8,
                  position: "absolute", top: "-8px", right: "150px", minWidth: 24,
                  textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                }}
                title="Linhas selecionadas"
              >
                {selectedRows.length}
              </span>
            )}
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
              <div
                style={{
                  position: "sticky", top: 0, zIndex: 110, background: "#fff",
                  paddingBottom: 8, marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                <SearchBar keyword={keyword} onKeywordChange={handleKeywordChange} inputRef={searchInputRef} />
                {filteredRows.length > 0 && (
                  <ColumnFilters
                    headers={filterableColumns}
                    rows={csvRows}
                    filters={columnFilters}
                    onFilterChange={handleColumnFilterChange}
                  />
                )}
                <button
                  style={{ marginBottom: 16, marginLeft: 8, background: "#e74c3c" }}
                  onClick={handleClearAll}
                >
                  Limpar tudo
                </button>
              </div>
              <ResultsTable
                rows={filteredRows}
                onSelectRows={handleSelectRows}
                selectedRows={selectedRows}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
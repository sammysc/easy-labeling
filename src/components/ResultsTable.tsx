import React, { useRef, useState, useEffect } from "react";
import { CsvRow } from "../utils/csvUtils";



interface ResultsTableProps {
  rows: CsvRow[];
  onSelectRows: (rows: CsvRow[]) => void;
  selectedRows: CsvRow[];
}

const INITIAL_ROWS = 30;
const LOAD_MORE_ROWS = 20;


const ResultsTable: React.FC<ResultsTableProps> = ({ rows, onSelectRows, selectedRows }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const selectedKeys = new Set(selectedRows.map(row => JSON.stringify(row)));
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setVisibleCount(INITIAL_ROWS);
    setSelected(new Set());
    setSelectAll(false);
  }, [rows]);


  const handleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      setSelected(new Set(visibleRows.map((_, idx) => idx)));
      setSelectAll(true);
    }
  }

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 10
    ) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_ROWS, rows.length));
    }
  };

  const handleSelect = (idx: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const handleAddSelected = () => {
    const selectedRows = Array.from(selected).map(idx => rows[idx]);
    onSelectRows(selectedRows);
    setSelected(new Set());
  };

  if (!rows || rows.length === 0) {
    return <div>Nenhum resultado encontrado.</div>;
  }

  const headers = Object.keys(rows[0]);
  const visibleRows = rows.slice(0, visibleCount);

  //uso de teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        setSelected(new Set(visibleRows.map((_, idx) => idx)));
        setSelectAll(true);
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        setSelected(new Set());
        setSelectAll(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleRows]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{ maxHeight: 400, overflowY: "auto", border: "1px solid #eee" }}
        onScroll={handleScroll}
      >
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  title="Selecionar todas as linhas visíveis"
                />
              </th>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => {
              const isAlreadySelected = selectedKeys.has(JSON.stringify(row));
              return (
                <tr
                  key={idx}
                  style={isAlreadySelected ? { background: "#e3f2fd" } : {}}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(idx)}
                      onChange={() => handleSelect(idx)}
                      style={isAlreadySelected ? { background: "#e3f2fd" } : {}}
                    />
                  </td>
                  {headers.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddSelected}
        disabled={selected.size === 0}
        style={{ marginTop: 12 }}
      >
        Adicionar selecionados
      </button>
    </div>
  );
};

export default ResultsTable;
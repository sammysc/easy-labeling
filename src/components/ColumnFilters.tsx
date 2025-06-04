import React from "react";
import { CsvRow } from "../utils/csvUtils";

interface ColumnFiltersProps {
  headers: string[];
  rows: CsvRow[];
  filters: { [key: string]: string };
  onFilterChange: (col: string, value: string) => void;
}

const ColumnFilters: React.FC<ColumnFiltersProps> = ({
  headers,
  rows,
  filters,
  onFilterChange,
}) => {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
      {headers.map((header) => {
        // Obtenha valores únicos para cada coluna
        const uniqueValues = Array.from(
          new Set(rows.map((row) => row[header]).filter(Boolean))
        );
        return (
          <div key={header}>
            <label style={{ fontWeight: 500 }}>{header}:</label>
            <select
              value={filters[header] || ""}
              onChange={(e) => onFilterChange(header, e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="">Todos</option>
              {uniqueValues.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnFilters;
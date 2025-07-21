import React, { useState, useEffect } from "react";
import { CsvRow } from "../utils/csvUtils";
import DownloadButton from "./DownloadButton";
import { toCsv } from "../utils/csvUtils";

interface SelectedRowsSidebarProps {
  selectedRows: CsvRow[];
  onRemoveRow: (idx: number) => void;
  onClose: () => void;
  open: boolean;
}

const EXCLUDED_COLUMNS = ["type", "score", "info"];
const EXTRA_COLUMNS = [
  { key: "Factor", label: "Factor", default: "1.0" },
  { key: "Offset", label: "Offset", default: "0.0" }
];

const LABEL_OPTIONS = [
  "app",
  "app.cip",
  "app.cip.process",
  "app.cip.process.medium",
  "app.cip.process.medium.cv",
  "app.cip.process.medium.return",
  "app.cip.process.medium.supply",
  "app.cip.state",
  "app.cip.state.circuit",
  "app.cip.state.circuit.aborted",
  "app.cip.state.circuit.active",
  "app.cip.state.circuit.complete",
  "app.cip.state.step",
  "app.cip.state.step.active",
  "app.cip.state.step.complete",
  "app.cip.state.step.manual_advance",
  "app.cip.state.wash_type",
  "app.valve",
  "app.valve.cmd",
  "app.valve.cmd.close",
  "app.valve.cmd.lower",
  "app.valve.cmd.open",
  "app.valve.cmd.upper",
  "app.valve.fb",
  "app.valve.fb.closed",
  "app.valve.fb.lower",
  "app.valve.fb.open",
  "app.valve.fb.upper",
  "app.valve.state",
  "control",
  "control.enable",
  "control.out",
  "control.pid",
  "control.pid.cv",
  "control.pid.err",
  "control.pid.kd",
  "control.pid.ki",
  "control.pid.kp",
  "control.pv",
  "control.sp",
  "quantity",
  "quantity.acceleration",
  "quantity.amountOfSubstance",
  "quantity.angle",
  "quantity.concentration",
  "quantity.conductance",
  "quantity.conductivity",
  "quantity.current",
  "quantity.current.A",
  "quantity.current.B",
  "quantity.current.C",
  "quantity.current.N",
  "quantity.density",
  "quantity.energy",
  "quantity.energy.electrical",
  "quantity.energy.electrical.active",
  "quantity.energy.electrical.apparent",
  "quantity.energy.electrical.reactive",
  "quantity.flow",
  "quantity.flow.mass",
  "quantity.flow.volume",
  "quantity.frequency",
  "quantity.humidity",
  "quantity.humidity.absolute",
  "quantity.humidity.relative",
  "quantity.humidity.specific",
  "quantity.impedance",
  "quantity.length",
  "quantity.level",
  "quantity.luminousIntensity",
  "quantity.mass",
  "quantity.massFraction",
  "quantity.ph",
  "quantity.position",
  "quantity.position.absolute",
  "quantity.position.relative",
  "quantity.power",
  "quantity.power.electrical",
  "quantity.power.electrical.active",
  "quantity.power.electrical.apparent",
  "quantity.power.electrical.complex",
  "quantity.power.electrical.powerFactor",
  "quantity.power.electrical.reactive",
  "quantity.pressure",
  "quantity.speed",
  "quantity.temperature",
  "quantity.time",
  "quantity.torque",
  "quantity.turbidity",
  "quantity.viscosity",
  "quantity.voltage",
  "quantity.voltage.A_B",
  "quantity.voltage.A_N",
  "quantity.voltage.B_C",
  "quantity.voltage.B_N",
  "quantity.voltage.C_A",
  "quantity.voltage.C_N",
  "quantity.volume",
  "quantity.weight",
  "substance",
  "substance.acid",
  "substance.acid.citric",
  "substance.acid.lactic",
  "substance.acid.malic",
  "substance.air",
  "substance.amf",
  "substance.ammonia",
  "substance.argon",
  "substance.brine",
  "substance.butter",
  "substance.carbonDioxide",
  "substance.carbonMonoxide",
  "substance.caustic",
  "substance.cheese",
  "substance.coffee",
  "substance.coffee.green",
  "substance.coffee.ground",
  "substance.coffee.roasted",
  "substance.cornSyrup",
  "substance.egg",
  "substance.egg.white",
  "substance.egg.yolk",
  "substance.eggPowder",
  "substance.eggPowder.white",
  "substance.eggPowder.yolk",
  "substance.emulsifier",
  "substance.essence",
  "substance.fat",
  "substance.flavoring",
  "substance.flour",
  "substance.fuel",
  "substance.glucose",
  "substance.gum",
  "substance.hfcs",
  "substance.honey",
  "substance.juice",
  "substance.juice.apple",
  "substance.juice.blend",
  "substance.juice.pear",
  "substance.juice.whiteGrape",
  "substance.ketchup",
  "substance.milk",
  "substance.milk.condensed",
  "substance.mix",
  "substance.mix.dry",
  "substance.mix.wet",
  "substance.moisture",
  "substance.molasse",
  "substance.mushroom",
  "substance.mustard",
  "substance.naturalGas",
  "substance.nitrogen",
  "substance.oil",
  "substance.oil.avocado",
  "substance.oil.canola",
  "substance.oil.olive",
  "substance.oil.palm",
  "substance.oil.soybean",
  "substance.oxygen",
  "substance.package",
  "substance.pectin",
  "substance.permeate",
  "substance.preservative",
  "substance.product",
  "substance.protein",
  "substance.puree",
  "substance.puree.apple",
  "substance.puree.tomato",
  "substance.rework",
  "substance.rinse",
  "substance.salt",
  "substance.starch",
  "substance.steam",
  "substance.sucralose",
  "substance.sucrose",
  "substance.sugar",
  "substance.sugar.cooked",
  "substance.sugar.raw",
  "substance.tomatoPaste",
  "substance.vacuum",
  "substance.vinegar",
  "substance.vinegar.balsamic",
  "substance.vinegar.cider",
  "substance.vinegar.distilled",
  "substance.vinegar.redWine",
  "substance.vinegar.white",
  "substance.vitaminC",
  "substance.water",
  "substance.water.acid",
  "substance.wheat",
  "system",
  "system.batch",
  "system.batch.count",
  "system.batch.id",
  "system.batch.size",
  "system.fault",
  "system.fault.class",
  "system.fault.class.alarm",
  "system.fault.class.external",
  "system.fault.class.operational",
  "system.fault.class.systemic",
  "system.fault.class.warning",
  "system.fault.quantifier",
  "system.fault.quantifier.multiple",
  "system.fault.quantifier.single",
  "system.production",
  "system.production.in",
  "system.production.out",
  "system.production.out.bad",
  "system.production.out.good",
  "system.production.out.total",
  "system.recipe",
  "system.recipe.id",
  "system.recipe.name",
  "system.routing",
  "system.routing.destination",
  "system.routing.source",
  "system.sku",
  "system.sku.id",
  "system.sku.name",
  "system.state",
  "system.state.bypass",
  "system.state.packml",
  "system.state.ws",
  "system.step",
  "system.step.active",
  "system.step.active.id",
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
  const [labels, setLabels] = useState<{ [idx: number]: string[] }>({});
  const [labelSearch, setLabelSearch] = useState<{ [idx: number]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<{ [idx: number]: string }>({});
  const [extraValues, setExtraValues] = useState<{ [idx: number]: { [key: string]: string } }>({});
  const [editedRows, setEditedRows] = useState<CsvRow[]>([]);


  useEffect(() => {
    setLabels({});
    setLabelSearch({});
    setSelectedCategory({});
    setExtraValues(
      Object.fromEntries(
        selectedRows.map((_, idx) => [
          idx,
          Object.fromEntries(EXTRA_COLUMNS.map(col => [col.key, col.default]))
        ])
      )
    );
    setEditedRows(selectedRows);
  }, [selectedRows, open]);



  const handleSelectChange = (idx: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setLabels(prev => {
      const currentCategory = selectedCategory[idx] || Object.keys(labelCategories)[0];
      const allOtherLabels = (prev[idx] || []).filter(
        label => !labelCategories[currentCategory].includes(label)
      );
      return {
        ...prev,
        [idx]: [...allOtherLabels, ...selected]
      };
    });
  };
  const handleRowFieldChange = (rowIdx: number, field: string, value: string) => {
    setEditedRows(prev =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, [field]: value } : row
      )
    );
  };

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

  const handleExtraChange = (idx: number, key: string, value: string) => {
    // Permite apenas números (float)
    if (!/^[-+]?\d*\.?\d*$/.test(value)) return;
    setExtraValues(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [key]: value
      }
    }));
  };

  const labelCategories = getLabelCategories(LABEL_OPTIONS);

  const getRowsWithLabels = () => {
    return editedRows.map((row, idx) => ({
      ...Object.fromEntries(
        Object.entries(row).filter(([key]) => !EXCLUDED_COLUMNS.includes(key))
      ),
      ...extraValues[idx],
      Labels: (labels[idx] || []).join(",")
    }));
  };

  if (!open) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={sidebarStyle}>
        <button onClick={onClose} style={{ float: "right" }}>Fechar</button>
        <h3>Linhas selecionadas</h3>
        <div style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto", marginBottom: "16px" }}>
          {editedRows.length === 0 ? (
            <div>Nenhuma linha selecionada ainda.</div>
          ) : (
            <table style={{ fontSize: "0.9em" }}>
              <thead>
                <tr>
                  {Object.keys(editedRows[0])
                    .filter(header => !EXCLUDED_COLUMNS.includes(header))
                    .map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  {EXTRA_COLUMNS.map(col => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Labels</th>
                  <th>Remover</th>
                </tr>
              </thead>
              <tbody>
                {editedRows.map((row, idx) => {
                  const category = selectedCategory[idx] || "";
                  const search = (labelSearch[idx] || "").toLowerCase();
                  let filteredOptions = LABEL_OPTIONS.filter(option =>
                    option.toLowerCase().includes(search)
                  );
                  if (category) {
                    filteredOptions = filteredOptions.filter(option => option.startsWith(category + "."));
                  }
                  return (
                    <tr key={idx}>
                      {Object.keys(row)
                        .filter(header => !EXCLUDED_COLUMNS.includes(header))
                        .map((header) => (
                          <td key={header}>
                            <input
                              type="text"
                              value={row[header]}
                              onChange={e => handleRowFieldChange(idx, header, e.target.value)}
                              style={{ width: "90%" }}
                            />
                          </td>
                        ))}
                      {EXTRA_COLUMNS.map(col => (
                        <td key={col.key}>
                          <input
                            type="text"
                            value={extraValues[idx]?.[col.key] ?? col.default}
                            onChange={e => handleExtraChange(idx, col.key, e.target.value)}
                            style={{ width: "80px" }}
                            inputMode="decimal"
                          />
                        </td>
                      ))}
                      <td>
                        <div style={{ marginBottom: 4 }}>
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
                                  onClick={() => {
                                    setLabels(prev => ({
                                      ...prev,
                                      [idx]: (prev[idx] || []).filter(label => label !== l)
                                    }));
                                  }}
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
                      <td>
                        <button onClick={() => onRemoveRow(idx)}>Remover</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ position: "sticky", bottom: 0, background: "#fff", paddingTop: "8px" }}>
          <DownloadButton
            csvContent={toCsv(getRowsWithLabels())}
            disabled={editedRows.length === 0}
          />
        </div>
      </div>
    </>
  );
};

export default SelectedRowsSidebar;
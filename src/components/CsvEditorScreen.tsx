import React, { useState, useMemo } from "react";
import FileUpload from "./FileUpload";
import DownloadButton from "./DownloadButton";
import { CsvRow, parseCsv, toCsv } from "../utils/csvUtils";

// Copie estas constantes do SelectedRowsSidebar para manter igual
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

interface CsvEditorScreenProps {
  onBack: () => void;
}

const CsvEditorScreen: React.FC<CsvEditorScreenProps> = ({ onBack }) => {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [labelSearch, setLabelSearch] = useState<{ [idx: number]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<{ [idx: number]: string }>({});
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
import React from "react";

interface SearchTipsModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchTipsModal: React.FC<SearchTipsModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 320,
          maxWidth: 400,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Dicas de Pesquisa</h2>
        <ul>
          <li>Digite uma ou mais palavras-chave separadas por espaço.</li>
          <li>
            Exemplo: <b>porta sensor</b> retorna linhas que contenham <b>porta</b> <i>e</i> <b>sensor</b> em qualquer coluna.
          </li>
          <li>A busca não diferencia maiúsculas de minúsculas.</li>
          <li>Para buscar parte de uma palavra, basta digitar o trecho desejado.</li>
          <li><b>Ctrl + A:</b> Selecionar todas as linhas.</li>
          <li><b>Ctrl + D:</b> Limpar seleção de linhas.</li>
          <li><b>Ctrl + F:</b> Pesquisar.</li>
        </ul>
        <button onClick={onClose} style={{ marginTop: 16 }}>Fechar</button>
      </div>
    </div>
  );
};

export default SearchTipsModal;
import React from "react";

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ keyword, onKeywordChange }) => {
  return (
    <div>
      <label htmlFor="search-bar">Buscar palavra-chave:</label>
      <input
        id="search-bar"
        type="text"
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
        placeholder="Digite palavras-chave em português (busca traduz automaticamente)"
      />
    </div>
  );
};

export default SearchBar;
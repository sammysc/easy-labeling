import React from "react";

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ keyword, onKeywordChange, inputRef }) => {
  return (
    <div>
      <label htmlFor="search-bar">Buscar palavra-chave:</label>
      <input
        id="search-bar"
        type="text"
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
        placeholder="Digite palavras-chave em português (busca traduz automaticamente)"
        ref={inputRef}
      />
    </div>
  );
};

export default SearchBar;
# Easy Labeling

Easy Labeling é uma aplicação web para leitura, busca, filtragem e seleção de variáveis em arquivos CSV extraídos de programas de CLPs. O objetivo é facilitar a análise e exportação de dados relevantes de grandes arquivos CSV, com recursos avançados de busca, tradução automática de palavras-chave e seleção acumulativa de linhas.

## Funcionalidades

- Upload de arquivos CSV no padrão de variáveis de CLP.
- Busca por palavras-chave em português, com tradução automática para inglês e alemão.
- Filtros por coluna (ex: filtrar apenas por `dataType`).
- Seleção de múltiplas linhas ao longo de várias buscas.
- Destaque visual das linhas já selecionadas.
- Scroll infinito para navegação eficiente em grandes arquivos.
- Painel lateral para revisão e remoção das linhas selecionadas.
- Download do resultado filtrado em novo arquivo CSV.
- Função "Auto Labeling" para seleção automática baseada em dicionário de traduções.
- Botão para limpar todos os filtros, busca e seleção de linhas.
- Dicas de pesquisa e interface amigável.

## Tecnologias Utilizadas

- [React](https://react.dev/) (com TypeScript)
- [PapaParse](https://www.papaparse.com/) (leitura de CSV)
- [FileSaver](https://github.com/eligrey/FileSaver.js/) (download de arquivos)
- CSS puro para estilização

## Como executar localmente

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/sammysc/easy-labeling.git
   cd easy-labeling
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Execute a aplicação:**
   ```sh
   npm start
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

```
src/
  App.tsx
  App.css
  components/
    FileUpload.tsx
    SearchBar.tsx
    ResultsTable.tsx
    DownloadButton.tsx
    SearchTipsModal.tsx
    SelectedRowsSidebar.tsx
    ColumnFilters.tsx
  utils/
    csvUtils.ts
    translations.ts
  types/
    index.ts
public/
  index.html
```

## Observações

- O dicionário de traduções pode ser expandido em [`src/utils/translations.ts`](src/utils/translations.ts).
- O filtro de coluna pode ser facilmente adaptado para outras colunas além de `dataType`.
- Para dúvidas ou sugestões, abra uma issue ou envie um pull request!

---

Desenvolvido por @sammysc.
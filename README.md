# Easy Labeling

Easy Labeling é uma aplicação web para leitura, busca, filtragem e seleção de variáveis em arquivos CSV extraídos de programas de CLPs. O objetivo é facilitar a análise e exportação de dados relevantes de grandes arquivos CSV, com recursos avançados de busca, tradução automática de palavras-chave e seleção acumulativa de linhas.

## Funcionalidades

- Upload de arquivos CSV no padrão de variáveis de CLP.
- Busca por palavras-chave em português, com tradução automática para inglês e alemão.
- Filtros por coluna (ex: filtrar apenas por `dataType`).
- Seleção de múltiplas linhas ao longo de várias buscas.
- Destaque visual das linhas já selecionadas.
- Scroll infinito para navegação eficiente em grandes arquivos.
- Painel lateral para revisão, edição e remoção das linhas selecionadas.
- Download do resultado filtrado em novo arquivo CSV.
- Função "Auto Labeling" para seleção automática baseada em dicionário de traduções.
- Botão para limpar todos os filtros, busca e seleção de linhas.
- Dicas de pesquisa e interface amigável.
- Tela inicial com opções para iniciar ou modificar um labeling.
- Editor de CSV com possibilidade de editar qualquer campo, inclusive Labels com seleção avançada.
- Barra de progresso para upload e auto labeling.
- Toasts de feedback para ações importantes.

## Tecnologias Utilizadas

- [React](https://react.dev/) (com TypeScript)
- [PapaParse](https://www.papaparse.com/) (leitura de CSV)
- [FileSaver](https://github.com/eligrey/FileSaver.js/) (download de arquivos)
- CSS puro para estilização
- Docker e Nginx para deploy

## Como executar localmente

### Usando Node.js

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

### Usando Docker

1. **Construa a imagem Docker:**
   ```sh
   docker build -t easy-labeling .
   ```

2. **Execute o container:**
   ```sh
      docker run --name easy_labeling -p 8080:80 easy-labeling
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:8080
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
    CsvEditorScreen.tsx
  utils/
    csvUtils.ts
    translations.ts
  types/
    index.ts
public/
  index.html
Dockerfile
nginx.conf
```

## Observações

- O dicionário de traduções pode ser expandido em [`src/utils/translations.ts`](src/utils/translations.ts).
- O filtro de coluna pode ser facilmente adaptado para outras colunas além de `dataType`.
- O deploy via Docker utiliza Nginx para servir os arquivos estáticos.

---

Desenvolvido por @sammysc
# CrisisFlow (SOS Coord) 🚨

O **CrisisFlow** (nome operacional: *SOS Coord*) é uma Single-Page Application (SPA) construída com React, desenhada para operar como uma extensão cognitiva para coordenadores de abrigos em cenários de catástrofe. 

Diferente de sistemas convencionais de gestão, sua interface foi projetada rigorosamente sob o princípio da *"usabilidade de sobrevivência"* (guiada pela norma ISO 13407). O sistema utiliza uma triagem de 5 níveis (P1-P5) e fluxos otimizados que permitem identificar gargalos críticos de suprimentos e realocar voluntários em poucos toques, mitigando erros humanos causados por fadiga e estresse extremo no front de emergência.

## 📱 Principais Funcionalidades (Foco em IHC)
- **Dashboard Tático (Visibilidade):** Triagem persistente usando escala de cores semânticas hospitalares para destacar prioridades imediatas.
- **Prevenção de Erros:** Ações de alto impacto isoladas e validação contextual *inline* para evitar perdas de dados.
- **Carga Cognitiva Reduzida:** Alocação de voluntários via *Drag-and-Drop* e uso de cores atreladas diretamente a ações urgentes.
- **Mobile-First:** Arquitetura focada em tablets para coordenadores em campo e smartphones para voluntários.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React (importado via CDN para facilitar prototipagem rápida)
- **Design:** CSS puro com responsividade para tablets e smartphones
- **Tipografia:** Inter (Google Fonts) configurada para alta legibilidade sob baixa iluminação
- **Iconografia:** Estética Material Icons / Heroicons

---

## 🚀 Como executar o projeto localmente

Como o projeto importa as bibliotecas do React diretamente via CDN, não é necessário rodar comandos como `npm install` ou configurar servidores Node.js pesados.

A melhor forma de visualizar o protótipo e testar as interações é utilizando o **VS Code** com a extensão **Live Server**.

### Pré-requisitos
1. Ter o [Visual Studio Code](https://code.visualstudio.com/) instalado.
2. Instalar a extensão **Live Server** (de Ritwick Dey) no VS Code. 
   - *Vá na aba de Extensões do VS Code (Ctrl+Shift+X), busque por "Live Server" e clique em "Install".*

### Passo a passo para rodar
1. Abra a pasta do projeto `CrisisFlow` no VS Code.
2. Na barra lateral (Explorer), localize o arquivo principal: **`CrisisFlow.html`**.
3. Clique com o **botão direito** em cima do arquivo `CrisisFlow.html` e selecione a opção **"Open with Live Server"**.
   - *(Alternativa: Clique no botão **"Go Live"** localizado na barra azul bem no canto inferior direito da janela do VS Code).*
4. O seu navegador padrão (Chrome, Edge, etc.) abrirá automaticamente uma nova aba no endereço local (geralmente `http://127.0.0.1:5500/CrisisFlow.html`) com o protótipo rodando em tempo real!

**Nota:** Ao usar o Live Server, qualquer alteração que você fizer no código HTML, CSS ou JS atualizará a página no navegador automaticamente, o que é excelente para o desenvolvimento de IHC.
# Calculadora de Dropshipping

Esta é uma aplicação React + TypeScript que simula uma calculadora de precificação para dropshipping, considerando taxas de marketplaces como Shopee e Mercado Livre.

## Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm (geralmente vem com o Node.js)

## Instalação e Execução

Siga estes passos para rodar o projeto localmente:

1.  **Acesse a pasta do projeto:**
    Abra seu terminal e navegue até a pasta criada:
    ```bash
    cd dropshipping-calculator-app
    ```

2.  **Instale as dependências:**
    Execute o comando abaixo para baixar todas as bibliotecas necessárias:
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    Para rodar a aplicação localmente:
    ```bash
    npm run dev
    ```

4.  **Acesse a aplicação:**
    O terminal mostrará um link (geralmente `http://localhost:5173/`). Clique nele ou copie e cole no seu navegador.

## Estrutura do Projeto

-   `src/components/DropshippingCalculator.tsx`: O componente principal da calculadora.
-   `src/App.tsx`: Ponto de entrada da aplicação que renderiza a calculadora.
-   `tailwind.config.js`: Configuração do Tailwind CSS para estilização.

## Dependências Principais

-   `react` / `react-dom`: Biblioteca de interface.
-   `lucide-react`: Ícones.
-   `tailwindcss`: Estilização.

## Notas

-   O projeto foi configurado usando Vite para melhor performance.
-   As taxas configuradas no código são baseadas em dados de 2024 (conforme código original).

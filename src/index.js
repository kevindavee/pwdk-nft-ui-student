import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRouter } from './Router';
import reportWebVitals from './reportWebVitals';
import { WalletProvider } from './WalletContext';
import { ContractProvider } from './ContractContext';
import { PrivateSaleProvider } from './PrivateSaleContext';
import { AirdropProvider } from './AirdropContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WalletProvider>
      <ContractProvider>
        <PrivateSaleProvider>
          <AirdropProvider>
            <AppRouter />
          </AirdropProvider>
        </PrivateSaleProvider>
      </ContractProvider>
    </WalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

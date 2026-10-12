import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import RootLayout from './root_layout.js';
import App from './app.js';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

// root.render(
//   <React.StrictMode>
//     {/* Провайдер навігації */}
//     <BrowserRouter>
//       <RootLayout/>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <App/>
    </QueryClientProvider>
  </React.StrictMode>
)
// src/pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  // 添加全局样式

  #control_panel {
    display: block;
    position: absolute;
    top: 550px;
    left: 300px;

    z-index: 100;

  }
  #control_panel>button {
    font-size: 2rem;
    margin-left: 15px;
  }

`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;

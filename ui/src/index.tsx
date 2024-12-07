import { FC, StrictMode, PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { LicenseInfo } from '@mui/x-license-pro';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

import 'flexboxgrid/css/flexboxgrid.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './global-styles.css';

import CONFIG from './config/config';
import reportWebVitals from './reportWebVitals';
import { MatomoProviderProps } from '@datapunt/matomo-tracker-react/lib/MatomoProvider';
import App from './App';
import { env } from './config/env';

import 'typeface-noto-sans';
import 'typeface-montserrat';

LicenseInfo.setLicenseKey(CONFIG.PUBLIC_MUI_KEY);

const MatotoProviderWithTypes = MatomoProvider as FC<
  PropsWithChildren<MatomoProviderProps>
>;

const instance = createInstance({
  urlBase: env.matomoHref,
  siteId: 1,
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <MatotoProviderWithTypes value={instance}>
      <App />
    </MatotoProviderWithTypes>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
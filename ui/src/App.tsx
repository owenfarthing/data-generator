import './App.css';
import './global-styles.css';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DownloadsPage from './containers/DownloadsPage';
import theme from './styles/theme';
import { MuiAlert } from './components/common/MuiAlert';

import * as actions from './state/global/actions';
import MockDataGeneratorPage from './containers/MockDataGeneratorPage';
import MockSchemasPage from './containers/MockSchemasPage';

const queryClient = new QueryClient();

function App() {
	return (
		<div className='App'>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Router>
						<div className='pageWrapper'>
							<Routes>
								<Route path='/*' element={<MockSchemasPage />} />
								<Route path='/downloads/*' element={<DownloadsPage />} />
								<Route path='/data/:id/*' element={<MockDataGeneratorPage />} />
							</Routes>
						</div>
					</Router>
					<MuiAlert />
				</QueryClientProvider>
			</ThemeProvider>
		</div>
	);
};

export default App;

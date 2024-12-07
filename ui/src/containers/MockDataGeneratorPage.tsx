// extenal imports	
import { useEffect, useMemo } from 'react';

// internal imports
import MockDataGeneratorWrapper from '../components/MockDataGenerator';

import { Route, Routes, useNavigate } from 'react-router-dom';

export default function MockDataGeneratorPage() {
	const navigate = useNavigate();

	const isAuthorized = useMemo(() => {
		// check any page-specific permissions here
		return true;
	}, []);

	useEffect(() => {
		if (!isAuthorized) {
			navigate('/unauthorized', { replace: true });
		}
	}, [navigate, isAuthorized]);

	return (
		<div style={{ minHeight: 'calc(100vh - 100px)', padding: 20 }}>
			<Routes>
				<Route path='/' element={<MockDataGeneratorWrapper />} />
			</Routes>
		</div>
	);
}
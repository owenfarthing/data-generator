// extenal imports	
import { useEffect, useMemo } from 'react';

// internal imports
import MockSchemasWrapper from '../components/MockSchemas';

import { Route, Routes, useNavigate } from 'react-router-dom';

export default function MockSchemasPage() {
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
				<Route path='/' element={<MockSchemasWrapper />} />
			</Routes>
		</div>
	);
}
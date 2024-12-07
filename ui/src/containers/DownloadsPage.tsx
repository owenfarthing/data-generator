// extenal imports	
import { useEffect, useMemo } from 'react';

// internal imports
import DownloadsWrapper from '../components/Downloads';

import { Route, Routes, useNavigate } from 'react-router-dom';

export default function DownloadsPage() {
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
				<Route path='/' element={<DownloadsWrapper />} />
			</Routes>
		</div>
	);
}
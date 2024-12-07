// extenal imports
import { Divider, LinearProgress, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Build, Visibility } from '@mui/icons-material';

// internal imports
import config from '../config/config';

import { useMockDataGeneratorSlice } from '../state/store';
import * as actions from '../state/mock-data-generator/actions';
import Builder from './mock-data-generator/Builder';
import Previewer from './mock-data-generator/Previewer';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function MockDataGenerator() {
	const selectedTab = useMockDataGeneratorSlice(state => state.selectedTab);
	const schemaName = useMockDataGeneratorSlice(state => state.schemaName);
	const lastSaved = useMockDataGeneratorSlice(state => state.lastSaved);
	const navigate = useNavigate();
	const params = useParams();
	const { isLoading } = useQuery({
		enabled: !!params.id,
		refetchOnMount: false,
		queryKey: ['schema', params.id],
		queryFn: async () => await actions.loadMockSchema(+params.id!),
		refetchOnWindowFocus: false
	});

	if (!params.id) {
		navigate('/unauthorized');
		return <></>;
	} else {
		return (
			<>
				<div>
					<Paper elevation={0} style={styles.paper}>
						{isLoading
							? (
								<div style={styles.progressContainer}>
									<Typography fontSize={15} fontStyle='italic'>Loading schema...</Typography>
									<LinearProgress style={styles.progress} />
								</div>
							)
							: (
								<>
									<div style={styles.header}>
										<div style={{ ...styles.headerSide, justifyContent: 'flex-start' }}>
											<Typography fontSize={17} fontWeight='bold'>{schemaName}</Typography>
										</div>
										<div style={{ ...styles.headerSide, justifyContent: 'flex-end' }}>
											<Typography fontSize={13} fontStyle='italic'>Last Saved: {lastSaved}</Typography>
										</div>
									</div>


									<div style={styles.divider}>
										<Divider />
									</div>

									<Tabs
										onChange={(_, newTab) => actions.updateTab(newTab)}
										style={styles.tabs}
										value={selectedTab}
									>
										<Tab
											icon={<Build />}
											iconPosition='start'
											label='Build'
											value={config.MOCK_DATA_GENERATOR_TABS.BUILD}
										/>

										<Tab
											icon={<Visibility />}
											iconPosition='start'
											label='Preview'
											value={config.MOCK_DATA_GENERATOR_TABS.PREVIEW}
										/>
									</Tabs>

									<div style={styles.container}>
										{selectedTab === config.MOCK_DATA_GENERATOR_TABS.BUILD && <Builder id={+params.id} />}
										{selectedTab === config.MOCK_DATA_GENERATOR_TABS.PREVIEW && <Previewer />}
									</div>
								</>
							)
						}
					</Paper>
				</div>
			</>
		);
	}
}

const styles = {
	divider: {
		width: '100%',
		height: 1
	},
	container: {
		width: '100%',
		overflow: 'hidden'
	},
	header: {
		width: '100%',
		height: 35,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0px 10px 0px'
	},
	headerSide: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	paper: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		border: '1px solid #EAEDF1',
		height: 'calc(100vh - 170px)'
	},
	progressContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column' as const,
		justifyContent: 'center',
		alignItems: 'center'
	},
	progress: {
		width: 300,
		height: 5
	},
	tabs: {
		alignItems: 'center',
		overflow: 'hidden',
		width: '100%'
	}
};
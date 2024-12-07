// extenal imports	
import { MouseEventHandler, useState } from 'react';
import { Download } from '@mui/icons-material';
import { Button, ClickAwayListener, Paper, Popper, PopperProps, TextField, Typography } from '@mui/material';

// internal imports
import ButtonWithTooltip from '../common/ButtonWithTooltip';

export default function ExportMenu(
	props: {
		schemaId?: number,
		disabled?: boolean,
		download: (rowCount: number) => void,
		buttonStyle?: Record<string, number | string>
	}
) {
	const { schemaId, disabled = false, download, buttonStyle = {} } = props;
	const [exportAnchorEl, setOptionsAnchorEl] = useState<PopperProps['anchorEl']>(null);
	const [size, setSize] = useState(1000);

	const handleClick: MouseEventHandler = (event) => {
		setOptionsAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setOptionsAnchorEl(null);
	};
	const handleConfirm = () => {
		download(size);
		handleClose();
	};

	return (
		<div>
			<ButtonWithTooltip
				buttonProps={{
					onClick: handleClick,
					disabled,
					startIcon: <Download />,
					size: 'small',
					variant: 'outlined',
					style: buttonStyle
				}}
				tooltipProps={{
					title: 'Export'
				}}
			>
				Export
			</ButtonWithTooltip>

			{exportAnchorEl &&
				<ClickAwayListener onClickAway={handleClose}>
					<Popper
						anchorEl={exportAnchorEl}
						open={Boolean(exportAnchorEl)}
						placement='bottom-end'
					>
						<Paper style={{ padding: 10 }}>
							<div style={styles.textContainer}>
								<Typography fontSize={13} fontWeight='bold' marginRight='5px'>Row Count:</Typography>
								<TextField
									value={size}
									onChange={(e) => setSize(+e.target.value)}
									type='number'
									style={{ width: 80, minWidth: 80 }}
									sx={styles.textFieldOverrides}
								/>
							</div>

							<div style={styles.confirmContainer}>
								<Button
									onClick={handleConfirm}
									size='small'
									variant='outlined'
								>
									Export
								</Button>
							</div>
						</Paper>
					</Popper>
				</ClickAwayListener>
			}
		</div>
	);
}

const styles = {
	button: {
		borderRadius: 0
	},
	confirmContainer: {
		display: 'flex',
		justifyContent: 'right'
	},
	textContainer: {
		width: 'fit-content',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5
	},
	textFieldOverrides: {
		'& .MuiInputBase-root': {
			fontSize: '13px'
		},
		'& .MuiInputBase-input': {
			padding: '5px'
		}
	}
};
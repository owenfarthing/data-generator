// extenal imports	
import React, { ReactElement } from 'react';
import {
	Button, Dialog as MuiDialog, DialogProps as MuiDialogProps,
	DialogActions, DialogContent, DialogTitle, ButtonProps
} from '@mui/material';

export interface DialogProps {
	open: boolean,
	title?: JSX.Element | string,
	width?: number | string,
	height?: number | string,
	mainContainerStyle?: Record<string, number | string>,
	onClose: MuiDialogProps['onClose'],
	children: ReactElement | ReactElement[],
	primaryLabel?: string,
	primaryAction?: ButtonProps['onClick'],
	primaryActionStyles?: Record<string, number | string>,
	disabled?: boolean,
	secondaryLabel?: string,
	secondaryAction?: ButtonProps['onClick'],
	secondaryDisabled?: boolean,
	tertiaryLabel?: string,
	tertiaryAction?: ButtonProps['onClick'],
	tertiaryDisabled?: boolean,
	fourthLabel?: string,
	fourthAction?: ButtonProps['onClick'],
	fourthActionDisabled?: boolean
}

const Dialog = (props: DialogProps) => {
	const { open, title, width, height, mainContainerStyle, onClose } = props;

	return (
		<MuiDialog
			open={open}
			sx={{
				'& .MuiPaper-root': {
					maxWidth: '100%',
					width: width || 800,
					height: height || 'fit-content'
				}
			}}
			onClose={onClose}
		>
			<div style={{ height: '100%' }}>
				<DialogTitle
					sx={{
						color: '#3c4144',
						fontFamily: 'Roboto',
						fontSize: 21,
						height: 50,
						padding: '10px'
					}}
				>
					{title}
				</DialogTitle>
				<DialogContent style={{ ...mainContainerStyle, height: 'calc(100% - 90px)' }}>
					{props.children}
				</DialogContent>
				<DialogActions style={{ height: 40 }}>
					{props.fourthLabel &&
						<Button
							variant='outlined'
							onClick={props.fourthAction}
							disabled={props.fourthActionDisabled}
							style={styles.button}
							id='fourth-dialog-btn'
							size='small'
						>
							{props.fourthLabel}
						</Button>
					}
					{props.tertiaryLabel &&
						<Button
							variant='outlined'
							onClick={props.tertiaryAction}
							disabled={props.tertiaryDisabled}
							style={styles.button}
							id='tertiary-dialog-btn'
							size='small'
						>
							{props.tertiaryLabel}
						</Button>
					}
					{props.secondaryLabel &&
						<Button
							variant='outlined'
							onClick={props.secondaryAction}
							disabled={props.secondaryDisabled}
							style={styles.button}
							id='secondary-dialog-btn'
							size='small'
						>
							{props.secondaryLabel}
						</Button>
					}
					{props.primaryLabel &&
						<Button
							variant='contained'
							onClick={props.primaryAction}
							disabled={props.disabled}
							id='primary-dialog-btn'
							style={{
								...styles.button,
								...props.primaryActionStyles,
								margin: 0
							}}
							size='small'
						>
							{props.primaryLabel}
						</Button>
					}
				</DialogActions>
			</div>
		</MuiDialog>
	);

};

const styles = {
	button: {
		height: 25,
		marginRight: 10
	}
};

export default Dialog;
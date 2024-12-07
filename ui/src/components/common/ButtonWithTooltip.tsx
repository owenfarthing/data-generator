// extenal imports
import { ReactNode } from 'react';
import { Button, ButtonProps, IconButton, TooltipProps } from '@mui/material';

// internal imports
import TooltipShortDelay from './TooltipShortDelay';

interface ButtonWithTooltipProps {
	buttonProps: ButtonProps,
	tooltipProps: Omit<TooltipProps, 'children'>,
	children?: ReactNode | string,
	icon?: JSX.Element
}

export default function ButtonWithTooltip(props: ButtonWithTooltipProps) {
	const { buttonProps, tooltipProps, icon } = props;

	return (
		<TooltipShortDelay
			placement={tooltipProps.placement || 'top'}
			{...tooltipProps}
		>
			<span>
				{icon
					? <IconButton size='small' {...buttonProps}>{icon}</IconButton>
					: <Button variant='outlined' {...buttonProps}>{props.children}</Button>
				}
			</span>
		</TooltipShortDelay>
	);
}
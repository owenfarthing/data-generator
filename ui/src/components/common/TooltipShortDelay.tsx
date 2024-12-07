// extenal imports	
import { Tooltip, TooltipProps } from '@mui/material';

export default function TooltipShortDelay(props: TooltipProps) {
	return (
		<Tooltip
			arrow
			enterDelay={400}
			enterNextDelay={400}
			{...props}
		/>
	);
}
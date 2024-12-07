import Dialog from 'components/common/Dialog';
import { SchemaType } from '../../types/types';
import * as apiRoutes from '../../api/routes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';

export default function CreateMockSchemaDialog(
	props: {
		id?: number,
		existingName: string,
		schemaType: SchemaType,
		onUpdate: () => void,
		onClose: () => void
	}
) {
	const { id, existingName, schemaType, onUpdate, onClose } = props;
	const newSchema = !id;
	const [name, setName] = useState(newSchema ? '' : existingName);
	const navigate = useNavigate();

	// queries
	const { isPending: isCreating, mutate: create } = useMutation({
		mutationKey: ['create', schemaType.toLowerCase(), name],
		mutationFn: async () => {
			let res = await apiRoutes.createMockSchema({ name, schemaType });
			if (res?.data?.id) navigate(`/data/${res.data.id}`);
		}
	});
	const { isPending: isSaving, mutate: save } = useMutation({
		mutationKey: ['save', 'name', id],
		mutationFn: async () => {
			await apiRoutes.saveMockSchema(id!, { name });
			onClose();
			onUpdate();
		}
	});

	const getTitle = () => {
		return newSchema
			? (isCreating ? 'Creating...' : 'Create')
			: (isSaving ? 'Saving...' : 'Save');
	};

	return (
		<Dialog
			open={true}
			primaryLabel={getTitle()}
			primaryAction={() => {
				if (newSchema) {
					create();
				} else {
					save();
				}
			}}
			disabled={isCreating || isSaving}
			secondaryLabel='Cancel'
			secondaryAction={onClose}
			onClose={onClose}
			width={400}
		>
			<Typography
				fontSize={17}
				fontStyle='italic'
				fontWeight='bold'
				marginBottom='2px'
			>
				New {schemaType} schema
			</Typography>

			<TextField
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder='Schema name'
				style={styles.textField}
				sx={styles.textFieldOverrides}
			/>
		</Dialog>
	);
}

const styles = {
	textField: {
		width: 250,
		minWith: 250
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
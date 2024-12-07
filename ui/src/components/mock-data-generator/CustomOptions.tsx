import { useQuery } from "@tanstack/react-query";
import CustomSelect from "components/common/CustomSelect";
import { NormalizedDataType } from "../../types/types";
import * as apiRoutes from '../../api/routes';

export default function CustomOptions(
	props: {
		id: string,
		dataType: NormalizedDataType
	}
) {
	// const { id, dataType } = props;
	// const { data: valueOptions, isLoading } = useQuery({
	// 	queryKey: ['options', dataType],
	// 	queryFn: async () => apiRoutes.getValueOptions(dataType)
	// });

	// return (
	// 	<CustomSelect
	// 		options={valueOptions?.data?.map(o => o)}

	// 	/>
	// )
}
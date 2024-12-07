import { createTheme } from '@mui/material';

const buttonStyles = {
	styleOverrides: {
		sizeSmall: {
			height: 25
		},
		root: {
			'&.Mui-disabled': {
				backgroundColor: 'white'
			}
		}
	}
};

const dataGridStyles = {
	styleOverrides: {
		root: {
			fontSize: '13px',
			borderRadius: 0,
			borderLeft: 'none',
			borderRight: 'none',
			borderBottom: 'none',
			'& .MuiDataGrid-row:hover': {
				backgroundColor: '#E9EAEB'
			},
			'& .MuiDataGrid-row.Mui-selected': {
				backgroundColor: 'rgba(0, 131, 143, .3)'
			},
			'& .MuiDataGrid-row.Mui-selected:hover': {
				backgroundColor: 'rgba(0, 151, 163, .3)'
			},
			'& .MuiDataGrid-cell:focus': {
				outline: 'none',
			},
			'& .MuiDataGrid-cell:focus-within': {
				outline: 'none'
			},
			'& .MuiDataGrid-columnHeader:focus': {
				outline: 'none',
			},
			'& .MuiDataGrid-columnHeader:focus-within': {
				outline: 'none'
			},
			'& .MuiDataGrid-columnHeader': {
				paddingLeft: '5px',
				paddingRight: '5px'
			},
			'& .MuiDataGrid-columnHeaderTitle': {
				fontWeight: 'bold'
			},
			'& .MuiTablePagination-root': {
				fontSize: '15px',
				paddingTop: 10
			},
			'& .MuiTablePagination-selectLabel': {
				fontSize: '13px',
				marginBottom: 2
			},
			'& .MuiTablePagination-displayedRows': {
				fontSize: '13px',
				marginBottom: 2
			},
			'& .MuiDataGrid-footerContainer': {
				minHeight: 40,
				height: 40,
				paddingBottom: 3
			},
			'& .MuiSelect-select': {
				fontSize: '13px'
			}
		}
	},
	defaultProps: {
		slotProps: {
			columnMenu: {
				sx: {
					'&& .MuiListItemText-primary': {
						fontSize: 13,
						fontFamily: 'Roboto, sans-serif'
					},
					'&& .MuiSvgIcon-root': {
						fontSize: 17,
					},
					'&& .MuiButtonBase-root': {
						height: 25
					},
				}
			},
			filterPanel: {
				sx: {
					'&& .MuiFormLabel-root': {
						fontSize: 13,
						fontFamily: 'Roboto, sans-serif'
					},
					'&& .MuiInputBase-root': {
						fontSize: 15,
						fontFamily: 'Roboto, sans-serif'
					},
					'&& .MuiButtonBase-root': {
						fontSize: 13,
						fontFamily: 'Roboto, sans-serif'
					},
				}
			},
			basePopper: {
				sx: {
					'& .MuiMenuItem-root': {
						fontSize: 13,
						fontFamily: 'Roboto, sans-serif',
						height: 25
					}
				}
			}
		}
	}
};

const iconButtonStyles = {
	styleOverrides: {
		sizeSmall: {
			fontSize: 20,
			borderRadius: 0
		}
	}
};

const iconStyles = {
	styleOverrides: {
		root: {
			fontSize: 19
		}
	}
};

const tooltipStyles = {
	styleOverrides: {
		tooltip: {
			fontSize: '13px',
			fontWeight: 400,
			color: 'rgb(255, 255, 255)',
			fontFamily: 'Roboto, sans-serif',
			backgroundColor: 'rgba(0, 0, 0, 0.80)',
			maxWidth: '500px'
		},
		arrow: {
			color: 'rgba(0, 0, 0, 0.80)',
		}
	}
};

const tabStyles = {
	styleOverrides: {
		root: {
			height: 35,
			minHeight: 35,
			borderRadius: 0,
			border: 'none'
		}
	}
};

const tabsStyles = {
	styleOverrides: {
		root: {
			minHeight: 35
		}
	}
};

const themeOverrides = {
	components: {
		MuiButton: buttonStyles,
		MuiDataGrid: dataGridStyles,
		MuiIconButton: iconButtonStyles,
		MuiSvgIcon: iconStyles,
		MuiTooltip: tooltipStyles,
		MuiTab: tabStyles,
		MuiTabs: tabsStyles
	}
};

export default createTheme(themeOverrides);
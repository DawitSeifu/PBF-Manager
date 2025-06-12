import { IncentivePlugin } from '@blsq/blsq-report-components';
import { ContractPlugin } from '@blsq/blsq-report-components';
import { InvoicePlugin } from '@blsq/blsq-report-components';
import { BrowseDataPlugin } from '@blsq/blsq-report-components';
import { DataEntryPlugin} from '@blsq/blsq-report-components';
import EthSpecificPlugin  from './EthSpecificPlugin';

export const plugins = [
	InvoicePlugin,
	ContractPlugin,
	IncentivePlugin,
	DataEntryPlugin,
	BrowseDataPlugin,
	EthSpecificPlugin,
];
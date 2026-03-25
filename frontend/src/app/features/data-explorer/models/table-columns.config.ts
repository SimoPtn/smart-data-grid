import { TableColumn } from './table-column.model';

export const DEFAULT_TABLE_COLUMNS: TableColumn[] = [
  {
    key: 'name',
    label: 'Name',
    visible: true,
    sortable: true,
    hideable: true
  },
  {
    key: 'email',
    label: 'Email',
    visible: true,
    sortable: true,
    hideable: true
  },
  {
    key: 'company',
    label: 'Company',
    visible: true,
    sortable: false,
    hideable: true
  },
  {
    key: 'status',
    label: 'Status',
    visible: true,
    sortable: false,
    hideable: true
  },
  {
    key: 'score',
    label: 'Score',
    visible: true,
    sortable: true,
    hideable: true
  },
  {
    key: 'country',
    label: 'Country',
    visible: false,
    sortable: false,
    hideable: true
  },
  {
    key: 'actions',
    label: 'Actions',
    visible: true,
    sortable: false,
    hideable: false
  }
];
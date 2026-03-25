export type SortableColumn = 'name' | 'email' | 'score';

export type DataTableColumnKey =
  | 'name'
  | 'email'
  | 'company'
  | 'status'
  | 'score'
  | 'country'
  | 'actions';

export interface TableColumn {
  key: DataTableColumnKey;
  label: string;
  visible: boolean;
  sortable: boolean;
  hideable: boolean;
}
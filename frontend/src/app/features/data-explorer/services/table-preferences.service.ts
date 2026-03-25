import { Injectable } from '@angular/core';
import { DEFAULT_TABLE_COLUMNS } from '../models/table-columns.config';
import { DataTableColumnKey, TableColumn } from '../models/table-column.model';

@Injectable({
  providedIn: 'root'
})
export class TablePreferencesService {
  private readonly storageKey = 'smart-data-grid-table-columns';

  getColumns(): TableColumn[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return this.cloneDefaultColumns();
    }

    try {
      const parsed = JSON.parse(stored) as TableColumn[];

      return this.mergeWithDefaults(parsed);
    } catch {
      localStorage.removeItem(this.storageKey);
      return this.cloneDefaultColumns();
    }
  }

  saveColumns(columns: TableColumn[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(columns));
  }

  resetColumns(): TableColumn[] {
    const defaults = this.cloneDefaultColumns();
    this.saveColumns(defaults);
    return defaults;
  }

  private cloneDefaultColumns(): TableColumn[] {
    return DEFAULT_TABLE_COLUMNS.map(column => ({ ...column }));
  }

  private mergeWithDefaults(storedColumns: TableColumn[]): TableColumn[] {
    const storedMap = new Map<DataTableColumnKey, TableColumn>(
      storedColumns.map(column => [column.key, column])
    );

    return DEFAULT_TABLE_COLUMNS.map(defaultColumn => {
      const storedColumn = storedMap.get(defaultColumn.key);

      if (!storedColumn) {
        return { ...defaultColumn };
      }

      return {
        ...defaultColumn,
        visible: defaultColumn.hideable ? storedColumn.visible : true
      };
    });
  }
}
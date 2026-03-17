import { TestBed } from '@angular/core/testing';

import { DataExplorerStore } from './data-explorer-store';

describe('DataExplorerStore', () => {
  let service: DataExplorerStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExplorerStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

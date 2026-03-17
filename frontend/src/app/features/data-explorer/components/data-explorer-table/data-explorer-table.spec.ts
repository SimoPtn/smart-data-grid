import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerTable } from './data-explorer-table';

describe('DataExplorerTable', () => {
  let component: DataExplorerTable;
  let fixture: ComponentFixture<DataExplorerTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

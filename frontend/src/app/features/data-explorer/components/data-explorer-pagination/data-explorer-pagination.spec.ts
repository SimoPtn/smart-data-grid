import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerPagination } from './data-explorer-pagination';

describe('DataExplorerPagination', () => {
  let component: DataExplorerPagination;
  let fixture: ComponentFixture<DataExplorerPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

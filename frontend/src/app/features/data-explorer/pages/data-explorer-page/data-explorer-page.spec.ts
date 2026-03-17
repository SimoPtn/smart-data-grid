import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerPage } from './data-explorer-page';

describe('DataExplorerPage', () => {
  let component: DataExplorerPage;
  let fixture: ComponentFixture<DataExplorerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

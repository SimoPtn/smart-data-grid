import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerToolbar } from './data-explorer-toolbar';

describe('DataExplorerToolbar', () => {
  let component: DataExplorerToolbar;
  let fixture: ComponentFixture<DataExplorerToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorerToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorerToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

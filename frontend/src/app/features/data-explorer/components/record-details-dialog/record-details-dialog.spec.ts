import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDetailsDialog } from './record-details-dialog';

describe('RecordDetailsDialog', () => {
  let component: RecordDetailsDialog;
  let fixture: ComponentFixture<RecordDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordDetailsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

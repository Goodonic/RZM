import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTablesDialogComponent } from './edit-tables-dialog.component';

describe('EditTablesDialogComponent', () => {
  let component: EditTablesDialogComponent;
  let fixture: ComponentFixture<EditTablesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTablesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTablesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

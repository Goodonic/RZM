import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDescriptionDialogComponent } from './add-description-dialog.component';

describe('AddDescriptionDialogComponent', () => {
  let component: AddDescriptionDialogComponent;
  let fixture: ComponentFixture<AddDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDescriptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

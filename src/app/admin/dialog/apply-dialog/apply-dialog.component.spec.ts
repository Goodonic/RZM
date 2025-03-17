import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyDialogComponent } from './apply-dialog.component';

describe('ApplyDialogComponent', () => {
  let component: ApplyDialogComponent;
  let fixture: ComponentFixture<ApplyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

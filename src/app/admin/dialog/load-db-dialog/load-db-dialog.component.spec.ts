import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDBDialogComponent } from './load-db-dialog.component';

describe('LoadDBDialogComponent', () => {
  let component: LoadDBDialogComponent;
  let fixture: ComponentFixture<LoadDBDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDBDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDBDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

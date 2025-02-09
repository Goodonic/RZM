import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomEditorComponent } from './nom-editor.component';

describe('NomEditorComponent', () => {
  let component: NomEditorComponent;
  let fixture: ComponentFixture<NomEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NomEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NomEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

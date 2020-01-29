import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerejerciciosmisplanesPage } from './verejerciciosmisplanes.page';

describe('VerejerciciosmisplanesPage', () => {
  let component: VerejerciciosmisplanesPage;
  let fixture: ComponentFixture<VerejerciciosmisplanesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerejerciciosmisplanesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerejerciciosmisplanesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

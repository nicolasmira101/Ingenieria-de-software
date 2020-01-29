import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisplanesPage } from './misplanes.page';

describe('MisplanesPage', () => {
  let component: MisplanesPage;
  let fixture: ComponentFixture<MisplanesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisplanesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisplanesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

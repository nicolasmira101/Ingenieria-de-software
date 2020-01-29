import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopopesoPage } from './popopeso.page';

describe('PopopesoPage', () => {
  let component: PopopesoPage;
  let fixture: ComponentFixture<PopopesoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopopesoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopopesoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

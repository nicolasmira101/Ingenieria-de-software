import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerplatosmisdietasPage } from './verplatosmisdietas.page';

describe('VerplatosmisdietasPage', () => {
  let component: VerplatosmisdietasPage;
  let fixture: ComponentFixture<VerplatosmisdietasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerplatosmisdietasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerplatosmisdietasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

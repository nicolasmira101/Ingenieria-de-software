import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoPage } from './popo.page';

describe('PopoPage', () => {
  let component: PopoPage;
  let fixture: ComponentFixture<PopoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

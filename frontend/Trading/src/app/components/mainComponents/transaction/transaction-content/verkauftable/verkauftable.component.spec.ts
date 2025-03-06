import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerkauftableComponent } from './verkauftable.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VerkauftableComponent', () => {
  let component: VerkauftableComponent;
  let fixture: ComponentFixture<VerkauftableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerkauftableComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(VerkauftableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


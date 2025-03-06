import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KauftableComponent } from './kauftable.component';

describe('StocktableComponent', () => {
  let component: KauftableComponent;
  let fixture: ComponentFixture<KauftableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KauftableComponent]
    });
    fixture = TestBed.createComponent(KauftableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

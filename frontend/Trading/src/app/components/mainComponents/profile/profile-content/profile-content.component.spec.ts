import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileContentComponent } from './profile-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from 'src/app/components/layoutComponents/header/header.component';

xdescribe('ProfileContentComponent', () => {
  let component: ProfileContentComponent;
  let fixture: ComponentFixture<ProfileContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileContentComponent, HeaderComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ProfileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});


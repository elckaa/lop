import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRound } from './create-round';

describe('CreateRound', () => {
  let component: CreateRound;
  let fixture: ComponentFixture<CreateRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

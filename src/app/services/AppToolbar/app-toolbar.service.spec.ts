import { TestBed } from '@angular/core/testing';

import { AppToolbarService } from './app-toolbar.service';

describe('AppToolbarService', () => {
  let service: AppToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WebsocketSendService } from './websocket-send.service';

describe('WebsocketSendService', () => {
  let service: WebsocketSendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketSendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

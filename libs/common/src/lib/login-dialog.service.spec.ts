import { TestBed } from '@angular/core/testing';
import { TuiDialogService } from '@taiga-ui/core';
import { Subject } from 'rxjs';

import { LoginDialogService } from './login-dialog.service';

describe('LoginDialogService', () => {
  const dialogResult = new Subject<unknown>();
  const dialogs = { open: jest.fn(() => dialogResult) };
  let service: LoginDialogService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        LoginDialogService,
        { provide: TuiDialogService, useValue: dialogs },
      ],
    });
    service = TestBed.inject(LoginDialogService);
  });

  it('coordinates header and session-expired requests through one dialog guard', () => {
    service.open();
    service.open();
    expect(dialogs.open).toHaveBeenCalledTimes(1);

    dialogResult.next(undefined);
    dialogResult.complete();
    service.open();
    expect(dialogs.open).toHaveBeenCalledTimes(2);
  });
});

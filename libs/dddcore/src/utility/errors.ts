import { Exception } from '../error';

export const InvalidStartEndDateError = Exception.New(
  'D00002',
  'Invalid start or end date',
);
export const InvalidPageError = Exception.New('D00003', 'Invalid page');
export const InvalidPageSizeError = Exception.New(
  'D00004',
  'Invalid page size',
);

export const InvalidNumberMinMaxError = Exception.New(
  'D00005',
  'Invalid min or max number',
);

import { Controller, createScope } from 'rx-effects';
import {
  BehaviorSubject,
  catchError,
  defer,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { Logger } from '../logger';
import { sharewSingleReplay } from '../rxjs';

import { createSearchParams } from './createSearchParams';
import { isPlainObject } from './utils';


import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { map, filter, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CHANGE_SEARCH_FIELD, CLEAR_SKILLS, SEARCH_SKILLS_REQUEST } from '../actions/actionTypes';
import { searchSkillsRequest, searchSkillsSuccess, searchSkillsFailure } from '../actions/actionCreators';
import {  of, throwError } from 'rxjs';

export const changeSearchEpic = action$ => action$.pipe(
    ofType(CHANGE_SEARCH_FIELD),
    map(o => o.payload.search.trim()),
    filter(o =>  o !== ''),
    debounceTime(100),
    map(o => searchSkillsRequest(o))
)

export const clearSkillsEpic = action$ => action$.pipe(
    ofType(CLEAR_SKILLS),
    switchMap(o => of(searchSkillsEpic(o))).pipe(
        map(o => throwError(new Error('cancel'))),
        catchError(e => of(searchSkillsFailure(e)))
    )
)

export const searchSkillsEpic = action$ => action$.pipe(
    ofType(SEARCH_SKILLS_REQUEST),
    map(o => o.payload.search),
    map(o => new URLSearchParams({ q: o })),
    switchMap(o => ajax.getJSON(`${process.env.REACT_APP_SEARCH_URL}?${o}`).pipe(
        map(o => searchSkillsSuccess(o)),
        catchError(e => of(searchSkillsFailure(e))),
    )),
);

import { combineReducers } from 'redux';

import files from './files';
import user from './user';
import loading from './loading'

const reducers = combineReducers({ files, user, loading });

export default reducers;

import { combineReducers } from 'redux';

import files from './files';
import user from './user'

const reducers = combineReducers({ files, user });

export default reducers;

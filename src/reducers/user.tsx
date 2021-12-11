const initialState: string = ''

const user = (state = initialState, action: any) => {
  const { payload } = action;

  switch (action.type) {
    case 'USERID':

      return payload;

    default:
      return state;
  }
};

export default user;
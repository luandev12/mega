const initialState: any = [];

const files = (state = initialState, action: any) => {
  const { payload } = action;

  switch (action.type) {
    case 'UPLOAD_FILES':
      state = [...state, payload];

      return state;

    default:
      return state;
  }
};

export default files;

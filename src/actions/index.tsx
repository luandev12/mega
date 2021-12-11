export const uploadFile = (data: any) => {
  return {
    type: 'UPLOAD_FILES',
    payload: data,
  };
};

export const userDocument = (data: any) => {
  return {
    type: 'USERID',
    payload: data
  }
}

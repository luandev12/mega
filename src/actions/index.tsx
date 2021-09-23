export const uploadFile = (data: any) => {
  return {
    type: 'UPLOAD_FILES',
    payload: data,
  };
};

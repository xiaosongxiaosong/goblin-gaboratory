const eventStateType = (state) => {
  if (1 === state) {
    return 'success';
  } else if (0 === state || 3 === state || 4 === state || 5 === state || 7 === state || 8 === state || 9 === state) {
    return 'processing';
  } else {
    return 'error';
  }
};


export default {
  eventStateType,
};

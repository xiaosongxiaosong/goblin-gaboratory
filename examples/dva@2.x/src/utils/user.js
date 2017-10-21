import storage from './storage';

// const getJwtFromCookie = () => {
//   const jwt = $.cookie('jwtinfo');
//   return jwt;
// };
const getJwtFromClient = () => {
  const prefix = storage.getPrefix();
  storage.setPrefix('client');
  const jwt = storage.get('jwt');
  storage.setPrefix(prefix);
  return jwt;
};
export default {
  // getJwtFromCookie,
  getJwtFromClient,
};

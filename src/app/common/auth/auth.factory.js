let AuthFactory = function () {
  let auth = {
    isSignedIn: false,
    needSignedIn: true
  };

  return {
    isSignedIn() {
      return (!auth.needSignedIn) || auth.isSignedIn;
    },
    needSignedIn() {
      return auth.needSignedIn;
    },
    setSingedIn() {
      auth.isSignedIn = true;
    },
    setNeedSignedIn() {
      auth.needSignedIn = false;
    },
    login(info) {
      return new Promise(function (resolve, reject) {
        // ... some code
        setTimeout(function() {
          resolve(value);
        }, 2000);
        // reject(error);
      });
    }
  };
};

export default AuthFactory;

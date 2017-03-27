let UserFactory = function () {
  let user = {
    isSignedIn: false,
    needSignedIn: true
  };

  let getUser = () => {
    return user;
  };

  let isSignedIn = () => {
    return user.isSignedIn;
  };

  return {
    isSignedIn() {
      return (!user.needSignedIn) || user.isSignedIn;
    },
    needSignedIn() {
      return user.needSignedIn;
    },
    setSingedIn() {
      user.isSignedIn = true;
    },
    setNeedSignedIn() {
      user.needSignedIn = false;
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

export default UserFactory;

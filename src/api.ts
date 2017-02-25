class Api {
  url = 'http://10.0.3.2:3001';

  getSteps(session) {
    return fetch(this.url + '/step/' + session, {method: 'GET'});
  }

  postStep(session, user, position) {
    return fetch(this.url + '/step', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user, session, position})
    });
  }

  postJson(params, object) {
    return fetch(this.url + params, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object)
    });
  }
}

export const API = new Api();
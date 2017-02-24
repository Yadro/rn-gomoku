class Api {
  url = 'http://localhost:3001';

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
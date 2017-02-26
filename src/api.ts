class Api {
  // url = 'http://10.0.3.2:3001';
  url = 'http://gomokus.herokuapp.com';

  create() {
    return fetch(this.url + '/create', {method: 'POST'})
      .then(response => response.json())
      .then(json => {
        if (json.session) {
          return json.session;
        }
      })
      .catch(e => console.error(e));
  }

  getSteps(session) {
    return fetch(this.url + '/step/' + session, {method: 'GET'})
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (!(json && json.steps)) return;
        return json.steps.map(e => {
          const res = /(\d+);(\d+)/.exec(e.position);
          if (!res) return {};
          return {
            position: {
              x: +res[1],
              y: +res[2],
            },
            user: e.user,
          };
        });
      })
      .catch(e => console.error(e));
  }

  getCurrentUser(session) {
    return fetch(this.url + '/current_user/' + session, {method: 'GET'})
      .then(response => response.json())
      .then(json => {
        console.log(json);
        return json.user;
      })
      .catch(e => console.error(e));
  }

  postStep(data) {
    return this.postJson('/step', data)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        return responseJson;
      })
      .catch(e => {
        console.error(e);
      })
  }

  postJson(url, data) {
    return fetch(this.url + url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }
}

export const API = new Api();
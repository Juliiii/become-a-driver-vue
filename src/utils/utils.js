function initcheckbox(json) {
  let option = [];

  if (json['Type'] === '1') {
    option = [
      {
        label: '对',
        value: '1',
        index: 'A'
      },
      {
        label: '错',
        value: '2',
        index: 'B'
      }
    ]
  } else {
    option = [
      {
        label: `${json.a}`,
        value: '1',
        index: 'A'
      },
      {
        label: `${json.b}`,
        value: '2',
        index: 'B'
      },
      {
        label: `${json.c}`,
        value: '3',
        index: 'C'
      },
      {
        label: `${json.d}`,
        value: '4',
        index: 'D'
      }
    ]
  }
  return option;
}

function update(index) {
  return new Promise((resolve, reject) => {
    let params = {
      r: Math.random(),
      index: index,
    }
    let str = '';
    for (var key in params) {
      str = str + key + "=" + params[key] + "&";
    }
    str = str.substr(0, str.length - 1);
    fetch('/api/get_question?' + str)
              .then(res => {
                return res.json();
              })
              .then(data => {
                console.log(data);
                resolve(data);
              })
              .catch(err => {});
  });
}

function computeAnswer(json) {
  if (json['Type'] === '1') {
    switch (json['ta']) {
      case '1': return '对'; break;
      case '2': return '错'; break;
    }
  } else {
    switch (json['ta']) {
      case '1': return 'A'; break;
      case '2': return 'B'; break;
      case '3': return 'C'; break;
      case '4': return 'D'; break;
    }
  }
}

function deepclone(json) {
  return JSON.parse(JSON.stringify(json));
}



class storage {
  constructor() {
    this.store = window.localStorage;
  }

  save(key, value) {
    this.store.setItem(key, value);
  }

  get(key) {
    return this.store.getItem(key)
  }

  remove(key) {
    this.store.removeItem(key);
  }
}

export {
  update,
  initcheckbox,
  computeAnswer,
  deepclone,
  storage
}

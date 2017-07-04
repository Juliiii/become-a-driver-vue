
/**
 * get the selectitems of some problem 
 * 
 * @param {object} json the data of problem in the type JSON
 * @returns {object} option the option of the problem, such as selectitems
 */
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

/**
 * get the data in JSON of some problem
 * 
 * @param {number} problemId
 * @returns the data in JSON of some problem
 */
function update(problemId) {
  return new Promise((resolve, reject) => {
    let params = {
      r: Math.random(),
      index: problemId
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

/**
 * get the answer of some problem
 * 
 * @param {any} json the data in JSON of this problem
 * @returns the answer
 */
function computeAnswer(json) {
  if (json['Type'] === '1') {
    switch (json['ta']) {
      case '1': return '对';
      case '2': return '错';
    }
  } else {
    switch (json['ta']) {
      case '1': return 'A';
      case '2': return 'B';
      case '3': return 'C';
      case '4': return 'D';
    }
  }
}

/**
 * deep clone
 * 
 * @param {any} json the target object 
 * @returns the copy of the object
 */
function deepclone(json) {
  return JSON.parse(JSON.stringify(json));
}



export {
  update,
  initcheckbox,
  computeAnswer,
  deepclone
}

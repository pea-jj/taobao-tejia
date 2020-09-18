let getDataById = (id) => {
  console.log('single request id', id)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(id + 10)
    }, 800)
  })
}

let getDataByIds = (ids) => {
  console.log('multi request ids', ids)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ids.map(item => item + 10))
    }, 800)
  })
}

const STATUS_ENUM = {
  WAIT: 'wait',
  START: 'start',
}

class Task {
  constructor({ id, singleFn, multiFn }) {
    this.status = STATUS_ENUM.WAIT;
    this.ids = new Set();
    this.multiFn = null;
    this.singleFn = singleFn;
    this.multiFn = multiFn;
    this.add(id)
    this.run(id);
  }

  run() {
    this.promise = Promise.resolve().then(() => {
      this.status = STATUS_ENUM.START;
      if (this.ids.size) {
        const ids = Array.from(this.ids);
        return getDataByIds(Array.from(ids))
          .then((resultList) => {
            if (!Array.isArray(resultList)) {
              throw new Error('result error')
            }
            let result = {};
            ids.forEach((id, index) => result[id] = resultList[index]);
            return result;
          })
      }
    })
  }

  add(id) {
    this.ids.add(id);
  }
}

const mergeWrapper = (singleFn, multiFn, taskQueen = []) => (id) => {
  let task = taskQueen.find(v => v.status === 'wait');
  if (!task) {
    task = new Task({ id, singleFn, multiFn });
    taskQueen.push(task);
  } else {
    task.add(id);
  }
  return task.promise.then(result => result[id])
}

const cacheWrapper = (singleFn, cacheMap = new Map()) => (id) => {
  if (cacheMap.has(id)) {
    return Promise.resolve(cacheMap.get(id)())
  } else {
    return singleFn(id).then(data => {
      if (!cacheMap.has(id)) {
        cacheMap.set(id, () => data)
      }
      return data;
    }).catch(e => {
      if (!cacheMap.has(id)) {
        cacheMap.set(id, () => Promise.reject(e))
      }
      return Promise.reject(e)
    })
  }
}

// getDataById = mergeWrapper(getDataById, getDataByIds);
// getDataById = cacheWrapper(getDataById);
// const getR = (id) => {
//   return getDataById(id).then(data => console.log('single resolve', data, id))
//     .catch(e => console.error('single catch', e, id))
// }

// getR(1);
// setTimeout(() => {
//   getR(4)
//   getR(5)
// }, 0)
// Promise.resolve().then(() => {
//   getR(2)
// })
// getR(3).then(() => {
//   getR(6)
//   getR(7)
// })

// getR(1)
// setTimeout(() => { getR(1) }, 1500)
// getR(2)

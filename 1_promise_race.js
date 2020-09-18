Promise.myRace = (promiseList) => {
  if (!Array.isArray(promiseList) || !promiseList.length) {
    throw new Error('error param');
  }
  return new Promise((resolve, reject) => {
    promiseList.forEach(p => {
      Promise.resolve(p).then(data => {
        return resolve(data);
      }).catch(reject)
    })
  })
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
    console.log('s')
  }, 800)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('error');
    console.log('e')
  }, 709)
})

Promise.myRace([p1, p2]).then(data => {
  console.log('resolve', data)
}).catch(error => {
  console.log('catch', error)
})

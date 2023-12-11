/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 * the function should return a promise just like before
 */

function sleep(milliseconds) {
  let i = 0;
  while (i <= milliseconds * 10) {
    i++;
    console.log(i);
  }
  return new Promise((res, rej) => {
    return res();
  });
}

module.exports = sleep;

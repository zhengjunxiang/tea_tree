const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 监听数据的变化
 * @param obj 需要监听的对象
 * @param name 需要监听的属性
 * @param func 数据变化后的回调函数
 */
const watch = (obj, name, func) => {
  Object.defineProperty(obj, name, {
    get: function() {
      return obj;
    },
    set: newValue => {
      func && func(newValue);
    },
  });
};

module.exports = {
  formatTime,
  watch
}

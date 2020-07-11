export default {
  example: state => {
    return state;
  },
  tasksObj: state => {
      const arrayToObject = (array) =>
      array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
      }, {})

      return arrayToObject(state.tasks)
  },
};

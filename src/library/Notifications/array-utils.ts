export const remove = (arr: number[], item: number) => {
  const newArr = [...arr];
  newArr.splice(newArr.findIndex(i => i === item), 1);
  return newArr;
};

let newIndex = 0;
export const add = (arr: number[]) => {
  newIndex++;
  return [...arr, newIndex];
};

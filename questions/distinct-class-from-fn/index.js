//

class NamedClass {
  constructor(name) {
    this.name = name;
  }
}

const wrapClassFunction = (fn) => {
  const obj = fn;
  obj.wrapped = true;
  return obj;
}

const createNamed = wrapClassFunction((name) => {
  return {
    name
  };
});

const createObj = (cof, name) => {
  if (cof.wrapped) {
    return cof(name);
  } else {
    return new cof(name);
  }
}

console.log(createObj(NamedClass, "NamedClass").name);
console.log(createObj(createNamed, "createNamed").name);

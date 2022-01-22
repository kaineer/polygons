const foo = () => {
  const a = { b: { c: 1 } };
  a.b.d = { hello: "foo" };

  delete a.b.d;

  console.log(a);
}

const bar = () => {
  const a = { b: { c: 1 } };
  a.b.d = { hello: "foo" };

  delete(a.b.d);

  console.log(a);
}

foo();
bar();

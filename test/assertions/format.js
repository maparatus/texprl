const assertions = [
  {
    skip: true,
    input: (
`all(1, "foo",
    true,
3.14, false,
  #foobar
)`
    ),
    expected: (
`all(
  1,
  "foo",
  true,
  3.14,
  false,
  #foobar,
)`
    ),
  },
  {
    skip: true,
    input: (
`step(    1,
    0,   rgb(255, 0, 0),
1,
rgb(0, 255, 0),
2,

  rgb(0, 0, 255),

)`
    ),
    expected: (
`step(1,
  0, rgb(255, 0, 0),
  1, rgb(0, 255, 0),
  2, rgb(0, 0, 255),
)`
    ),
  },
];

export default assertions;

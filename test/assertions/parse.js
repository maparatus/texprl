const assertions = [
  {
    input: "foo()",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 0,
          to: 5,
          value: ["foo"],
          children: [],
        },
      ],
    },
  },
  {
    input: "1+2",
    expected: {
      from: 0,
      to: 3,
      value: [],
      children: [
        {
          from: 1,
          to: 2,
          value: ["+"],
          children: [
            {
              from: 0,
              to: 1,
              value: 1,
              children: [],
            },
            {
              from: 2,
              to: 3,
              value: 2,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "1+2/3",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 1,
          to: 2,
          value: ["+"],
          children: [
            {
              from: 0,
              to: 1,
              value: 1,
              children: [],
            },
            {
              from: 3,
              to: 4,
              value: ["/"],
              children: [
                {
                  from: 2,
                  to: 3,
                  value: 2,
                  children: [],
                },
                {
                  from: 4,
                  to: 5,
                  value: 3,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: "3/2+3",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 3,
          to: 4,
          value: ["+"],
          children: [
            {
              from: 1,
              to: 2,
              value: ["/"],
              children: [
                {
                  from: 0,
                  to: 1,
                  value: 3,
                  children: [],
                },
                {
                  from: 2,
                  to: 3,
                  value: 2,
                  children: [],
                },
              ],
            },
            {
              from: 4,
              to: 5,
              value: 3,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "(3+2)/3",
    expected: {
      from: 0,
      to: 7,
      value: [],
      children: [
        {
          from: 5,
          to: 6,
          value: ["/"],
          children: [
            {
              from: 2,
              to: 3,
              value: ["+"],
              children: [
                {
                  from: 1,
                  to: 2,
                  value: 3,
                  children: [],
                },
                {
                  from: 3,
                  to: 4,
                  value: 2,
                  children: [],
                },
              ],
            },
            {
              from: 6,
              to: 7,
              value: 3,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "3-2*3",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 1,
          to: 2,
          value: ["-"],
          children: [
            {
              from: 0,
              to: 1,
              value: 3,
              children: [],
            },
            {
              from: 3,
              to: 4,
              value: ["*"],
              children: [
                {
                  from: 2,
                  to: 3,
                  value: 2,
                  children: [],
                },
                {
                  from: 4,
                  to: 5,
                  value: 3,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: "3*2-3",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 3,
          to: 4,
          value: ["-"],
          children: [
            {
              from: 1,
              to: 2,
              value: ["*"],
              children: [
                {
                  from: 0,
                  to: 1,
                  value: 3,
                  children: [],
                },
                {
                  from: 2,
                  to: 3,
                  value: 2,
                  children: [],
                },
              ],
            },
            {
              from: 4,
              to: 5,
              value: 3,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "(3-2)*3",
    expected: {
      from: 0,
      to: 7,
      value: [],
      children: [
        {
          from: 5,
          to: 6,
          value: ["*"],
          children: [
            {
              from: 2,
              to: 3,
              value: ["-"],
              children: [
                {
                  from: 1,
                  to: 2,
                  value: 3,
                  children: [],
                },
                {
                  from: 3,
                  to: 4,
                  value: 2,
                  children: [],
                },
              ],
            },
            {
              from: 6,
              to: 7,
              value: 3,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "(1+1)",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 2,
          to: 3,
          value: ["+"],
          children: [
            {
              from: 1,
              to: 2,
              value: 1,
              children: [],
            },
            {
              from: 3,
              to: 4,
              value: 1,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "(1+1",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 2,
          to: 3,
          value: ["+"],
          children: [
            {
              from: 1,
              to: 2,
              value: 1,
              children: [],
            },
            {
              from: 3,
              to: 4,
              value: 1,
              children: [],
            },
          ],
        },
        {
          from: 4,
          to: 4,
          value: ["$$ERROR"],
          children: [],
        },
      ],
    },
  },
  {
    input: "1+1+",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 3,
          to: 4,
          value: ["+"],
          children: [
            {
              from: 1,
              to: 2,
              value: ["+"],
              children: [
                {
                  from: 0,
                  to: 1,
                  value: 1,
                  children: [],
                },
                {
                  from: 2,
                  to: 3,
                  value: 1,
                  children: [],
                },
              ],
            },
            {
              from: 4,
              to: 4,
              value: ["$$ERROR"],
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "foo",
    expected: {
      from: 0,
      to: 3,
      value: [],
      children: [
        {
          from: 0,
          to: 0,
          value: ["$$ERROR"],
          children: [],
        },
        {
          from: 0,
          to: 3,
          value: "foo",
          children: [],
        },
      ],
    },
  },
  {
    input: "foo(",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 0,
          to: 4,
          value: ["foo("],
          children: [
            {
              from: 4,
              to: 4,
              value: ["$$ERROR"],
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "10()",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 0,
          to: 2,
          value: 10,
          children: [],
        },
        {
          from: 2,
          to: 4,
          value: ["$$ERROR"],
          children: [],
        },
      ],
    },
  },
  {
    input: "log10()",
    expected: {
      from: 0,
      to: 7,
      value: [],
      children: [
        {
          from: 0,
          to: 7,
          value: ["log10"],
          children: [],
        },
      ],
    },
  },
  {
    input: "foo ()",
    expected: {
      from: 0,
      to: 6,
      value: [],
      children: [
        {
          from: 0,
          to: 0,
          value: ["$$ERROR"],
          children: [],
        },
        {
          from: 0,
          to: 6,
          value: "foo ()",
          children: [],
        },
      ],
    },
  },
  {
    input: "+()",
    expected: {
      from: 0,
      to: 3,
      value: [],
      children: [
        {
          from: 0,
          to: 1,
          value: ["$$ERROR"],
          children: [],
        },
        {
          from: 2,
          to: 3,
          value: [")"],
          children: [],
        },
      ],
    },
  },
  {
    input: `(6+3/4)+4/9`,
    expected: {
      from: 0,
      to: 11,
      value: [],
      children: [
        {
          from: 7,
          to: 8,
          value: ["+"],
          children: [
            {
              from: 2,
              to: 3,
              value: ["+"],
              children: [
                {
                  from: 1,
                  to: 2,
                  value: 6,
                  children: [],
                },
                {
                  from: 4,
                  to: 5,
                  value: ["/"],
                  children: [
                    {
                      from: 3,
                      to: 4,
                      value: 3,
                      children: [],
                    },
                    {
                      from: 5,
                      to: 6,
                      value: 4,
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              from: 9,
              to: 10,
              value: ["/"],
              children: [
                {
                  from: 8,
                  to: 9,
                  value: 4,
                  children: [],
                },
                {
                  from: 10,
                  to: 11,
                  value: 9,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: `  
 foo(
   1+2/4,   
      bar(1),
foo((6+5)/2) ,
foo(   (  6  +  5  )  /      2     ) 
 )`,
    expected: {
      from: 0,
      to: 91,
      value: [],
      children: [
        {
          from: 4,
          to: 91,
          value: ["foo"],
          children: [
            {
              from: 13,
              to: 14,
              value: ["+"],
              children: [
                {
                  from: 12,
                  to: 13,
                  value: 1,
                  children: [],
                },
                {
                  from: 15,
                  to: 16,
                  value: ["/"],
                  children: [
                    {
                      from: 14,
                      to: 15,
                      value: 2,
                      children: [],
                    },
                    {
                      from: 16,
                      to: 17,
                      value: 4,
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              from: 28,
              to: 34,
              value: ["bar"],
              children: [
                {
                  from: 32,
                  to: 33,
                  value: 1,
                  children: [],
                },
              ],
            },
            {
              from: 36,
              to: 48,
              value: ["foo"],
              children: [
                {
                  from: 45,
                  to: 46,
                  value: ["/"],
                  children: [
                    {
                      from: 42,
                      to: 43,
                      value: ["+"],
                      children: [
                        {
                          from: 41,
                          to: 42,
                          value: 6,
                          children: [],
                        },
                        {
                          from: 43,
                          to: 44,
                          value: 5,
                          children: [],
                        },
                      ],
                    },
                    {
                      from: 46,
                      to: 47,
                      value: 2,
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              from: 51,
              to: 87,
              value: ["foo"],
              children: [
                {
                  from: 73,
                  to: 74,
                  value: ["/"],
                  children: [
                    {
                      from: 64,
                      to: 65,
                      value: ["+"],
                      children: [
                        {
                          from: 61,
                          to: 62,
                          value: 6,
                          children: [],
                        },
                        {
                          from: 67,
                          to: 68,
                          value: 5,
                          children: [],
                        },
                      ],
                    },
                    {
                      from: 80,
                      to: 81,
                      value: 2,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: "foo(  bar(  baz()))",
    expected: {
      from: 0,
      to: 19,
      value: [],
      children: [
        {
          from: 0,
          to: 19,
          value: ["foo"],
          children: [
            {
              from: 6,
              to: 18,
              value: ["bar"],
              children: [
                {
                  from: 12,
                  to: 17,
                  value: ["baz"],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: "1",
    expected: {
      from: 0,
      to: 1,
      value: [],
      children: [
        {
          from: 0,
          to: 1,
          value: 1,
          children: [],
        },
      ],
    },
  },
  {
    input: "-1",
    expected: {
      from: 0,
      to: 2,
      value: [],
      children: [
        {
          from: 0,
          to: 2,
          value: -1,
          children: [],
        },
      ],
    },
  },
  {
    input: "1--1",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 1,
          to: 2,
          value: ["-"],
          children: [
            {
              from: 0,
              to: 1,
              value: 1,
              children: [],
            },
            {
              from: 2,
              to: 4,
              value: -1,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "1.375",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 0,
          to: 5,
          value: 1.375,
          children: [],
        },
      ],
    },
  },
  {
    input: "-1.375",
    expected: {
      from: 0,
      to: 6,
      value: [],
      children: [
        {
          from: 0,
          to: 6,
          value: -1.375,
          children: [],
        },
      ],
    },
  },
  {
    input: "-9.87--1.375",
    expected: {
      from: 0,
      to: 12,
      value: [],
      children: [
        {
          from: 5,
          to: 6,
          value: ["-"],
          children: [
            {
              from: 0,
              to: 5,
              value: -9.87,
              children: [],
            },
            {
              from: 6,
              to: 12,
              value: -1.375,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "true",
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 0,
          to: 4,
          value: true,
          children: [],
        },
      ],
    },
  },
  {
    input: "false",
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 0,
          to: 5,
          value: false,
          children: [],
        },
      ],
    },
  },
  {
    input: "foo(true, false)",
    expected: {
      from: 0,
      to: 16,
      value: [],
      children: [
        {
          from: 0,
          to: 16,
          value: ["foo"],
          children: [
            {
              from: 4,
              to: 8,
              value: true,
              children: [],
            },
            {
              from: 10,
              to: 15,
              value: false,
              children: [],
            },
          ],
        },
      ],
    },
  },
  {
    input: "truefalse",
    expected: {
      from: 0,
      to: 9,
      value: [],
      children: [
        {
          from: 0,
          to: 4,
          value: true,
          children: [],
        },
        {
          from: 4,
          to: 9,
          value: ["$$ERROR"],
          children: [],
        },
      ],
    },
  },
  {
    input: "#foo",
    checkLookup: (id) => {
      if (id === "foo1") {
        return { backendId: "1111111" };
      }
    },
    expected: {
      from: 0,
      to: 4,
      value: [],
      children: [
        {
          from: 0,
          to: 4,
          value: ["Lookup"],
          children: [],
        },
      ],
    },
  },
  {
    input: "#foo1",
    checkLookup: (id) => {
      if (id === "foo1") {
        return { backendId: "1111111" };
      }
    },
    expected: {
      from: 0,
      to: 5,
      value: [],
      children: [
        {
          from: 0,
          to: 5,
          value: "1111111",
          children: [],
        },
      ],
    },
  },
  {
    input: "#foo 1",
    checkLookup: (id) => {
      return { backendId: "1111111" };
    },
    expected: {
      from: 0,
      to: 6,
      value: [],
      children: [
        {
          from: 0,
          to: 4,
          value: "1111111",
          children: [],
        },
        {
          from: 5,
          to: 6,
          value: ["$$ERROR"],
          children: [],
        },
      ],
    },
  },
  {
    skip: true,
    input: "#",
    expected: null,
    checkLookup: (id) => {
      return { backendId: "1111111" };
    },
  },
  {
    input: "#0",
    checkLookup: (id) => {
      if (id === "0") {
        return { backendId: "1111111" };
      }
    },
    expected: {
      from: 0,
      to: 2,
      value: [],
      children: [
        {
          from: 0,
          to: 2,
          value: "1111111",
          children: [],
        },
      ],
    },
  },
  {
    skip: true,
    input: "#-1",
    expected: null,
    checkLookup: (id) => {
      return { backendId: "1111111" };
    },
  },
  // ============
  {
    skip: true,
    input: `{"a": "b"}`,
    expected: null,
  },
  {
    skip: true,
    input: `{a: "b"}`,
    expected: null,
  },
  {
    skip: true,
    input: `{a: "foo}"}`,
    expected: null,
  },
  {
    skip: true,
    input: `{a: foo({b: 3})}`,
    expected: null,
  },
  // {
  //   skip: true,
  //   input: (
  // `$foo = 3; $bar = "string";
  // foo($foo, true, 1, $bar, 3.14)`
  //   ),
  //   expected: null,
  // },
  // {
  //   skip: true,
  //   input: (
  // `$foo = any(true, false);
  // $bar = any(false, true);
  // all(
  // $foo, $bar
  // )`
  //   ),
  //   expected: null,
  // },
  {
    input: `interpolate_hcl(linear(), 3,
  0, rgb(255, 0, 0),
  10, rgb(0, 255, 0),
)`,
    expected: {
      from: 0,
      to: 73,
      value: [],
      children: [
        {
          from: 0,
          to: 73,
          value: ["interpolate_hcl"],
          children: [
            {
              from: 16,
              to: 24,
              value: ["linear"],
              children: [],
            },
            {
              from: 26,
              to: 27,
              value: 3,
              children: [],
            },
            {
              from: 31,
              to: 32,
              value: 0,
              children: [],
            },
            {
              from: 34,
              to: 48,
              value: ["rgb"],
              children: [
                {
                  from: 38,
                  to: 41,
                  value: 255,
                  children: [],
                },
                {
                  from: 43,
                  to: 44,
                  value: 0,
                  children: [],
                },
                {
                  from: 46,
                  to: 47,
                  value: 0,
                  children: [],
                },
              ],
            },
            {
              from: 52,
              to: 54,
              value: 10,
              children: [],
            },
            {
              from: 56,
              to: 70,
              value: ["rgb"],
              children: [
                {
                  from: 60,
                  to: 61,
                  value: 0,
                  children: [],
                },
                {
                  from: 63,
                  to: 66,
                  value: 255,
                  children: [],
                },
                {
                  from: 68,
                  to: 69,
                  value: 0,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    skip: true,
    input: `foo([1, 2, 3])`,
    expected: null,
  },
  {
    skip: true,
    input: `format(
  upcase(get("FacilityName")),
  {"font-scale": 0.8},
  "\\n",
  {},
  downcase(get("Comments")),
  {"font-scale": 0.6}
)`,
    expected: null,
  },
];

export default assertions;

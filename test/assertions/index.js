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
      )
    `,
    expected: {
      from: 0,
      to: 126,
      value: [],
      children: [
        {
          from: 9,
          to: 121,
          value: ["foo"],
          children: [
            {
              from: 23,
              to: 24,
              value: ["+"],
              children: [
                {
                  from: 22,
                  to: 23,
                  value: 1,
                  children: [],
                },
                {
                  from: 25,
                  to: 26,
                  value: ["/"],
                  children: [
                    {
                      from: 24,
                      to: 25,
                      value: 2,
                      children: [],
                    },
                    {
                      from: 26,
                      to: 27,
                      value: 4,
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              from: 43,
              to: 49,
              value: ["bar"],
              children: [
                {
                  from: 47,
                  to: 48,
                  value: 1,
                  children: [],
                },
              ],
            },
            {
              from: 56,
              to: 68,
              value: ["foo"],
              children: [
                {
                  from: 65,
                  to: 66,
                  value: ["/"],
                  children: [
                    {
                      from: 62,
                      to: 63,
                      value: ["+"],
                      children: [
                        {
                          from: 61,
                          to: 62,
                          value: 6,
                          children: [],
                        },
                        {
                          from: 63,
                          to: 64,
                          value: 5,
                          children: [],
                        },
                      ],
                    },
                    {
                      from: 66,
                      to: 67,
                      value: 2,
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              from: 76,
              to: 112,
              value: ["foo"],
              children: [
                {
                  from: 98,
                  to: 99,
                  value: ["/"],
                  children: [
                    {
                      from: 89,
                      to: 90,
                      value: ["+"],
                      children: [
                        {
                          from: 86,
                          to: 87,
                          value: 6,
                          children: [],
                        },
                        {
                          from: 92,
                          to: 93,
                          value: 5,
                          children: [],
                        },
                      ],
                    },
                    {
                      from: 105,
                      to: 106,
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
];

export default assertions;

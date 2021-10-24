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
  {
    input: "foo(  bar(  baz()))",
    expected: {
      "from": 0,
      "to": 19,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 19,
          "value": [
            "foo"
          ],
          "children": [
            {
              "from": 6,
              "to": 18,
              "value": [
                "bar"
              ],
              "children": [
                {
                  "from": 12,
                  "to": 17,
                  "value": [
                    "baz"
                  ],
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    input: "1",
    expected: {
      "from": 0,
      "to": 1,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 1,
          "value": 1,
          "children": []
        }
      ]
    }
  },
  {
    input: "-1",
    expected: {
      "from": 0,
      "to": 2,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 2,
          "value": -1,
          "children": []
        }
      ]
    }
  },
  {
    input: "1--1",
    expected: {
      "from": 0,
      "to": 4,
      "value": [],
      "children": [
        {
          "from": 1,
          "to": 2,
          "value": [
            "-"
          ],
          "children": [
            {
              "from": 0,
              "to": 1,
              "value": 1,
              "children": []
            },
            {
              "from": 2,
              "to": 4,
              "value": -1,
              "children": []
            }
          ]
        }
      ]
    }
  },
  {
    input: "1.375",
    expected: {
      "from": 0,
      "to": 5,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 5,
          "value": 1.375,
          "children": []
        }
      ]
    }
  },
  {
    input: "-1.375",
    expected: {
      "from": 0,
      "to": 6,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 6,
          "value": -1.375,
          "children": []
        }
      ]
    }
  },
  {
    input: "-9.87--1.375",
    expected: {
      "from": 0,
      "to": 12,
      "value": [],
      "children": [
        {
          "from": 5,
          "to": 6,
          "value": [
            "-"
          ],
          "children": [
            {
              "from": 0,
              "to": 5,
              "value": -9.87,
              "children": []
            },
            {
              "from": 6,
              "to": 12,
              "value": -1.375,
              "children": []
            }
          ]
        }
      ]
    }
  },
  {
    input: "true",
    expected: {
      "from": 0,
      "to": 4,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 4,
          "value": true,
          "children": []
        }
      ]
    }
  },
  {
    input: "false",
    expected: {
      "from": 0,
      "to": 5,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 5,
          "value": false,
          "children": []
        }
      ]
    }
  },
  {
    input: "foo(true, false)",
    expected: {
      "from": 0,
      "to": 16,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 16,
          "value": [
            "foo"
          ],
          "children": [
            {
              "from": 4,
              "to": 8,
              "value": true,
              "children": []
            },
            {
              "from": 10,
              "to": 15,
              "value": false,
              "children": []
            }
          ]
        }
      ]
    }
  },
  {
    input: "truefalse",
    expected: {
      "from": 0,
      "to": 9,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 4,
          "value": true,
          "children": []
        },
        {
          "from": 4,
          "to": 9,
          "value": [
            "$$ERROR"
          ],
          "children": []
        }
      ]
    }
  },
  {
    input: "#foo",
    checkLookup: (id) => {
      console.log("id", id)
      if (id === "foo1") {
        return {backendId: "1111111"};
      }
    },
    expected: {
      "from": 0,
      "to": 4,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 4,
          "value": [
            "Lookup"
          ],
          "children": []
        }
      ]
    }
  },
  {
    input: "#foo1",
    checkLookup: (id) => {
      console.log("id", id)
      if (id === "foo1") {
        return {backendId: "1111111"};
      }
    },
    expected: {
      "from": 0,
      "to": 5,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 5,
          "value": "1111111",
          "children": []
        }
      ]
    }
  },
  {
    input: "#foo 1",
    checkLookup: (id) => {
      return {backendId: "1111111"};
    },
    expected: {
      "from": 0,
      "to": 6,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 4,
          "value": "1111111",
          "children": []
        },
        {
          "from": 5,
          "to": 6,
          "value": [
            "$$ERROR"
          ],
          "children": []
        }
      ]
    }

  },
  {
    skip: true,
    input: "#",
    expected: null,
    checkLookup: (id) => {
      console.log("id", id)
      return {backendId: "1111111"};
    }
  },
  {
    input: "#0",
    checkLookup: (id) => {
      console.log("id", id)
      if (id === "0") {
        return {backendId: "1111111"};
      }
    },
    expected: {
      "from": 0,
      "to": 2,
      "value": [],
      "children": [
        {
          "from": 0,
          "to": 2,
          "value": "1111111",
          "children": []
        }
      ]
    }
  },
  {
    skip: true,
    input: "#-1",
    expected: null,
    checkLookup: (id) => {
      console.log("id", id)
      return {backendId: "1111111"};
    }
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
  {
    skip: true,
    input: `
      $foo = 3; $bar = "string";
      foo($foo, true, 1, $bar, 3.14)
    `,
    expected: null,
  },
  {
    skip: true,
    input: `
      $foo = any(true, false);
      $bar = any(false, true);
      all(
        $foo, $bar
      )`,
    expected: null,
  },
  {
    input: `
      interpolate_hcl(linear(), 3,
        0, rgb(255, 0, 0),
        10, rgb(0, 255, 0),
      )
    `,
    expected: {
      "from": 0,
      "to": 103,
      "value": [],
      "children": [
        {
          "from": 7,
          "to": 98,
          "value": [
            "interpolate_hcl"
          ],
          "children": [
            {
              "from": 23,
              "to": 31,
              "value": [
                "linear"
              ],
              "children": []
            },
            {
              "from": 33,
              "to": 34,
              "value": 3,
              "children": []
            },
            {
              "from": 44,
              "to": 45,
              "value": 0,
              "children": []
            },
            {
              "from": 47,
              "to": 61,
              "value": [
                "rgb"
              ],
              "children": [
                {
                  "from": 51,
                  "to": 54,
                  "value": 255,
                  "children": []
                },
                {
                  "from": 56,
                  "to": 57,
                  "value": 0,
                  "children": []
                },
                {
                  "from": 59,
                  "to": 60,
                  "value": 0,
                  "children": []
                }
              ]
            },
            {
              "from": 71,
              "to": 73,
              "value": 10,
              "children": []
            },
            {
              "from": 75,
              "to": 89,
              "value": [
                "rgb"
              ],
              "children": [
                {
                  "from": 79,
                  "to": 80,
                  "value": 0,
                  "children": []
                },
                {
                  "from": 82,
                  "to": 85,
                  "value": 255,
                  "children": []
                },
                {
                  "from": 87,
                  "to": 88,
                  "value": 0,
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
  },
  {
    skip: true,
    input: `
      format(
        upcase(get("FacilityName")),
        {"font-scale": 0.8},
        "\n",
        {},
        downcase(get("Comments")),
        {"font-scale": 0.6}
      )
    `,
    expected: null,
  }
];

export default assertions;

let json = `
{ 
    "a": 1, 
    "b":   { "c": 2, "d": 3 }, 
    "e": 4, 
    "fff":{ "v": 10 } 
};
`;

const regex = /"(\w+)"\s*:\s*({[^{}]*})/g;

const pairs = [...json.matchAll(regex)].map(m => [m[1], m[2]]);

console.log(pairs);

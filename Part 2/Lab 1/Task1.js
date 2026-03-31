const user = "Иванов Иван Иванович";

const regexNum = user.replace(/^(\S+)\s+(\S+)\s+\S+$/, "$2 $1");

const regexGroup = user.replace(/^(?<lastName>\S+)\s+(?<firstName>\S+)\s+\S+$/, "$<firstName> $<lastName> ");
console.log(regexNum);
console.log(regexGroup);
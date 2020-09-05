function nsConvert(num, baseFrom, baseTo)
{
	if (baseFrom === baseTo) return num;
	return fromDecimal(toDecimal(num, baseFrom), baseTo).toUpperCase();
}

function toDecimal(num, baseFrom)
{
	return parseInt(num, baseFrom);
}

function fromDecimal(num, baseTo)
{
	return num.toString(baseTo);
}

console.log(nsConvert("31", 10, 16));

console.assert(nsConvert("23", 10, 2) === "10111", "Check 1");
console.assert(nsConvert("31", 10, 16) === "1F", "Check 2");
console.assert(nsConvert("1F", 16, 2) === "11111", "Check 3");
// TODO: add more tests

console.log("Finished all checks.");
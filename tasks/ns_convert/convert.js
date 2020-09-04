function nsConvert(num, baseFrom, baseTo)
{
	console.log('lul');
}



console.assert(nsConvert("23", 10, 2) === "10111", "Check 1");
console.assert(nsConvert("31", 10, 16) === "1F", "Check 2");
console.assert(nsConvert("1F", 16, 2) === "11111", "Check 3");
// TODO: add more tests

console.log("Finished all checks.");
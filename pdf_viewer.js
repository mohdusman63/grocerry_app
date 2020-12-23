let s="torn"
let h=[1,3,1,3,1,4,1,3,2,5,5,5,5,1,1,5,5,1,5,2,5,5,5,5,5,5]
console.log('hii')
let arr =[]
//console.log(h[0])
//console.log('hii')
for(let i=0;i<s.length;i++){
console.log(s.charCodeAt(i))
let value=s.charCodeAt(i)-97
let hvalue=h[value]
console.log(value,hvalue)
arr.push(hvalue)
console.log('========>')

}
console.log('<========')
console.log(arr)
let max=Math.max(...arr)
console.log(arr.length*max)
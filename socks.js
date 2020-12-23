let a=[1,2,1,2,1,3,2]
console.log('hii')
let min= Math.min(...a)    // 1
let max=Math.max(...a)
console.log(min ,max)
let result={}
for (let i = 0; i < a.length; i++) {
     if(!result[a[i]])
        result[a[i]] = 0;
         ++result[a[i]];
        }
let count=0
for (let i = min; i <=max; i++)
{
    if(result[i]>1)
    {
      count=count+Math.floor(result[i]/2);
       console.log(`${i} is  ${result[i]}`)

    }

}
console.log(count)
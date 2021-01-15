let a=[1,1,1,1,1,2,2,2,2,2,2,2,2,2,6,6,6,6,6,6,6,6,6,6,6,6]
 console.log('hiiiiii')
let min= Math.min(...a)    // 1
let max=Math.max(...a)
console.log(min,max)
let result=[]

for(let i=0;i<a.length;i++){
    if(!result[a[i]])
    result[a[i]] = 0
    result[a[i]]++
}
console.log(min)

let findmax=0,index=0;
for (let i = min; i <=max; i++)
{

    if(result[i]>0)

    {
        if(result[i]>findmax){
        findmax=result[i]
        index=i
        }

       console.log(`${i} is  ${result[i]}`)

    }

}
console.log(`=================><========`)
console.log(`=====>freq===>${findmax}===index ans====>${index} `)

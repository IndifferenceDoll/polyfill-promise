function Prom(fn){//声明promise构造函数
    this.state = 'pending'//pending,resolved,rejected//需要维护的状态
    this.value = null//用来存储回传的值
    try{//检验是否报错
        fn(this.resolve.bind(this),this.reject.bind(this))
    }catch(err){//捕获报错
        this.reject.bind(this)(err)//执行reject,应该新加一套catch流程，处理错误捕获
    }
    this.resolveFunc = []//存放所有.then中第一位的回调函数
    this.rejectFunc = []//存放所有.then第二位中的回调函数
}
Prom.prototype.resolve = function(val){//用来触发.then中第一个回调函数
    if(this.state === 'rejected'){return}//若reject先执行，则不执行resolve
    this.state = 'resolved'//修改状态
    this.value = val//暂存当前.then回传值
    if(typeof this.resolveFunc[0] === 'function'){//若当前.then的第一位参数是否函数
        this.value = this.resolveFunc[0](this.value)//是则执行，将返回值作为回传值暂存
        this.resolveFunc.shift()//将列表中执行过的方法删除
        this.resolve(this.value)//递归执行下一个.then
    }
}
Prom.prototype.reject = function(err){//用来触发.then中第二个回调函数
    if(this.state === 'resolved'){return}//若resolve先执行，则不执行reject
    this.state = 'rejected'//修改状态
    this.value = err//暂存当前.then回传值
    if(typeof this.rejectFunc[0] === 'function'){//若当前.then的第二位参数是否函数
        this.value = this.rejectFunc[0](this.value)//是则执行，将返回值作为回传值暂存
        this.rejectFunc.shift()//将列表中执行过的方法删除
        this.reject(this.value)//递归执行下一个.then
    }
}
Prom.prototype.then = function(){//首次执行用来获取各个回调函数并暂存
    this.resolveFunc.push(arguments[0])//获取第一位的回调函数并暂存
    this.rejectFunc.push(arguments[1])//获取第二位的回调函数并暂存
    return this//返回promise对象
}
function func(){
    return new Prom((resolve,reject)=>{
        setTimeout(()=>{
            console.log('fn')
            resolve('then')
        },2000)
    })
}
func().then(res=>{
    console.log(res)
    return 'next'
}).then(res=>{
    console.log(res)
})
//.then中执行异步会出问题，不能做到像原生promise一样的表现，依然按顺序执行，只是拿不到return，
//而是用undefined代替，因为无法模拟微任务的执行时机，所以.then里的函数添加不到微任务的队列里，
//所以结果意外，无法模拟模拟原生promise，可以试试在node的环境下用 process.nextTick把它推到微任务里面


//原生promise表现
// function fun(){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log('1')
//             resolve()
//         },2000)
//     })
// }
// fun().then(()=>{
//     setTimeout(()=>{
//         console.log('2')
//     },2000)
// }).then(()=>{
//     console.log('3')
// })
//两秒 1，马上3，近两秒2
function Prom(fn){
    this.state = 'pending'
//     this.value = null
    this.resFun = []
    this.rejFun = []
    try{
        fn(this.resolve.bind(this),this.reject.bind(this))
    }catch(err){
        this.reject(err)
    }
}
Prom.prototype.resolve = function(val){
    if(this.state === 'rejected' || this.resFun.length <= 0){return}
    this.state = 'resolved'
//     this.value = val
    if(typeof this.resFun[0] === 'function'){
        //this.value = this.resFun[0](val)
        val = this.resFun[0](val)
    }
    this.resFun.shift()
    this.resolve(val)
}
Prom.prototype.reject = function(val){
    if(this.state === 'resolved' || this.rejFun.length <= 0){return}
    this.state = 'rejected'
//     this.value = val
    if(typeof this.rejFun[0] === 'function'){
        //this.value = this.rejFun[0](val)
        val = this.rejFun[0](val)
    }
    this.rejFun.shift()
    this.reject(val)
}
Prom.prototype.then = function(){
    this.resFun.push(arguments[0])
    this.rejFun.push(arguments[1])
    return this
}

function func(){
    return new Prom((resolve,reject)=>{
        setTimeout(()=>{
            reject(1)
        },1000)
    })
}
func().then(res=>{
    console.log(res)
})
let corp  = {
    list: [],
    on: (fn) => {
        corp.list.push(fn);
    },
    emit: (...arg) => {
        corp.list.forEach(cb => {
            cb(...arg)
        })
    }
}
// let corp = {};   // 自定义一个公司对象
// // 这里放一个列表用来缓存回调函数
// corp.list = [];
// // 去订阅事件
// corp.on = function (fn) {
//     // 二话不说，直接把fn先存到列表中
//     this.list.push(fn);
// };
// // 发布事件
// corp.emit = function () {
//     // 当发布的时候再把列表里存的函数依次执行
//     this.list.forEach(cb => {
//         cb.apply(this, arguments);
//     });
// };

corp.on(function (position, salary) {
    console.log('你的职位是：' + position);
    console.log('期望薪水：' + salary);
});
corp.on(function(skill, hobby) {
    console.log('你的技能有： ' + skill);
    console.log('爱好： ' + hobby);
});

corp.emit('前端', 10000);
corp.emit('后端', 10001);
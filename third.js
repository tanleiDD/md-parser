// const fs = require("fs");

// let md = fs.readFileSync('example.md').toString()
let md = `# 2020-12-23
## 任务1
* a组件 0.2
* b组件 0.3
## 任务2
* 熟悉代码 0.1
* 学习xx使用 0.2
## 其它
* 学习Vue 0.1
* 写笔记 0.1
# 2020-12-22
## 任务1
* c组件 0.2
* d组件 0.2
## 任务2
* 开发q组件 0.4
## 其他
* 学习React 0.2
`

function mdParser(md) {

    // 通过正则匹配分割字符串，并存放到相应位置
    function mdSplit(s, reg1, reg2, obj, arrName) {
        // 分割得到title
        let match = s.matchAll(reg2)
        let end
        let val
        let start = 0
        if (val = match.next().value) {
            end = val.index
        }
        obj[arrName] = []
        obj.title = s.substring(start, end).replace(reg1, "").trim()
        start = end

        // 再分割
        while (val = match.next().value) {
            end = val.index
            obj[arrName].push({
                raw: s.substring(start, end)
            })
            start = end
        }
        // 如果 end 为 undefined， 说明没有子项
        if (end) {
            obj[arrName].push({
                raw: s.substring(end)
            })
        }


    }
    // 去掉多余空格
    md = md.split("\n").reduce((a, b)=>{return a.trim() + '\n' + b.trim()})
    // 假定 @ 是 # 的上一级
    md = "@\n" + md
    // 存放结果的对象
    let obj = {raw: md}

    mdSplit(obj.raw, /@/, /^# /mg, obj, 'tops')

    let tops = obj['tops']
    // 对分割后的部分，再进行处理
    for (let i=0; i<tops.length; i++) {

        mdSplit(tops[i].raw, /# /, /^## /mg, tops[i], 'tasks')
        let tasks = tops[i].tasks
        // 再再进行处理
        for (let j=0; j<tasks.length; j++) {

            mdSplit(tasks[j].raw, /## /, /^\* /mg, tasks[j], 'things')

            for (let k=0; k<tasks[j].things.length; k++) {

                let thing = tasks[j].things[k]
                let index = thing.raw.lastIndexOf(' ')

                if (index !== -1) {
                    thing.content = thing.raw.substring(0, index).replace("* ", "").trim()
                    thing.time = thing.raw.substring(index).trim()
                } else {
                    thing.content = thing.raw.replace("* ", "").substring(0).trim()
                    thing.time = "0"
                }
            }
        }
    }

    // 将解析过程中辅助用的raw属性删除
    function delAttr(arr) {
        for (let i=0; i<arr.length; i++) {
            delete arr[i].raw
            for (let item in arr[i]) {
                if (arr[i][item] instanceof Array) {
                    delAttr(arr[i][item])
                }
            }
        }
    }
    delAttr(obj.tops)

    return JSON.stringify(obj.tops)

}
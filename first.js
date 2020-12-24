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
    // 存放结果的数组
    let arr = []
    // 匹配 #
    let match = md.matchAll(/^# /mg)
    // 第一次匹配肯定在起始位置
    let start = 0
    // 将第一次匹配的放掉
    match.next()
    let end
    let val
    // 将字符串分割成各部分
    while (val = match.next().value)
    {
        end = val.index
        arr.push({
            raw: md.substring(start, end)
        })
        start = end
    }
    arr.push({
        raw: md.substring(start)
    })

    // 对分割后的部分，再进行处理
    for (let i=0; i<arr.length; i++) {
        // 匹配 ##
        let match = arr[i].raw.matchAll(/^## /mg)
        let end
        let val
        let start = 0
        if (val = match.next().value) {
            end = val.index
            
        }
        arr[i].tasks = []
        arr[i].title = arr[i].raw.substring(start, end).replace(/# /, "").trim()
        start = end
        // 再分割
        while (val = match.next().value) {
            end = val.index
            arr[i].tasks.push({
                raw: arr[i].raw.substring(start, end)
            })
            start = end
        }
        arr[i].tasks.push({
            raw: arr[i].raw.substring(end)
        })
        // 再再进行处理
        for (let j=0; j<arr[i].tasks.length; j++) {
            let task = arr[i].tasks[j]
            // console.log(task)
            let match = task.raw.matchAll(/^\* /mg)
            let end
            let val
            let start = 0
            if (val = match.next().value) {
                end = val.index
            }

            task.things = []
            task.title = task.raw.substring(start, end).replace(/## /, "").trim()
            start = end

            while (val = match.next().value) {
                end = val.index
                task.things.push({
                    raw: task.raw.substring(start, end)
                })
                start = end
            }
            task.things.push({
                raw: task.raw.substring(start)
            })

            for (let k=0; k<task.things.length; k++) {
                let thing = task.things[k]
                // console.log(thing)
                let index = thing.raw.lastIndexOf(' ')
                // console.log(index, thing.raw)
                if (index !== -1) {
                    thing.content = thing.raw.substring(0, index).replace("* ", "").trim()
                    thing.time = thing.raw.substring(index).trim()
                } else {
                    thing.content = thing.raw.replace("* ", "").substring(0).trim()
                    thing.time = "0"
                }
                // console.log(thing)
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
    delAttr(arr)

    return arr

}

console.log(JSON.stringify(mdParser(md)))
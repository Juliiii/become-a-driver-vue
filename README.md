## 简介

某一天跑到驾校一点通的官网，抓了一下包，发现了获取题目的api。然后开始写一个Vue版本的科目一WebApp。目前完成了顺序练习，随机练习，错题本和模拟测试四个核心功能。做题记录会存在localstorage。

## demo

![demo][1]

## 技术栈

+ vue
+ vue-router
+ fetch
+ webpack
+ scss

## 项目架构

```
- src
  - components        # 放dumb组件 
    - header.vue 
    - loading.vue
    - ...
  - containers        # 放smart组件
    - KeMuYiMock.vue
    - KeMuYiRandom.vue
    - ...
  - icons             # 图标
  - router            # 路由
  - scss              # 样式
  - utils             # 公共方法
  - App.vue
  - main.js           # 入口文件
```

## 使用方式

#### Step 1
```
git clone git@github.com:Juliiii/become-a-driver-vue.git
```

#### Step 2
```
npm i
```
#### Step 3
```
npm run dev
```

## 完善建议
+ 使用高阶组件，来减少基本类似的html,css代码，增强复用性
+ 有空可以完善UI和实现更多的功能

## License

MIT


  [1]: https://user-images.githubusercontent.com/23744602/30517793-687316f6-9b9c-11e7-9fe0-98d984c485fe.gif
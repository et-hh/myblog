## 关于版本号
[https://www.cnblogs.com/skylor/p/9675646.html](https://www.cnblogs.com/skylor/p/9675646.html)

### 基本版本格式
1 | 主版本号（Major）.次版本号（Minor）.修订号（Patch）-先行版本号
-- | --

v0.20.0-beta.1 

## 前期处理方式及由此导致的问题

> 每改点东西就发个版本，并且只递增修订号：0.1.1，0.1.2 。。。0.1.XX，直到感觉修订号太大就手动递增次版本号，比如从0.1.60改成0.2.0
   - 当线上出现bug需要修复时，没法知道应该改哪个版本。
> 为解决上述问题，加上tag机制和feature分支机制，即每开发一个新特性时，开一个新feature分支，每开一个新分支次级版本号加一，要测试时，直接从分支上发版本，并给版本加上tag和描述信息

<p><img src="https://github.com/zhouJiecode/notes/blob/master/1.PNG?raw=true" alt="123" width="379" height="372"></p>

   - 这种方式导致的问题是：版本功能不连续，比如0.19.0可能不包含0.18.xx的特性，而发布之后感觉中间的次级版本都是废版本
> 在fork分支和master上都能发版本
   - 在fork分支上发版本，tags只能在fork分支上看到，这导致追溯版本记录比较困难

## 预期方案

 仓库分两种：
- 主仓库 （发版本用）
- fork分支 （开发用）

存在三种分支：

|分支|用途|发布命令|
|:------|:---|:-----------|
|master|发布正式版本|**第一步 所有人<u>*在自己的fork分支*</u>上，将各自要发布的feature分支合入master解决冲突后，往<u>*主仓库master*</u>上提MR**<br>`git checkout master`<br>`git pull upstream master`<br>*`git merge feature-xx`<br>解决冲突。。。*<br>`git push origin master`<br>*到gitlab上从fork master往主仓库 master提MR*<br><br>**第二步 发布正式版本**<br>管理员处理好所有MR，然后执行以下命令<br>`git checkout master`<br>`npm version patch -m '发布正式版本'`<br>`git push origin master --tags`<br>`npm run build`<br>`npm publish`<br><br>**第三步 递增master分支次级版本号**（由管理员执行，改线上紧急bug发版时不需要这一步）<br>`npm version minor -m '递增master分支次级版本号'`<br>`git push origin master`|
|develop|主仓库：发布测试版本<br><br>fork分支：用于合入当前迭代所有代码并解决冲突，之后往主仓库develop提MR发布测试版本|`npm version prerelease --preid=beta -m '组件库发测试版本ttt'`<br>`git push origin develop --tags`<br><br>**以下两步由gitlab ci自动执行**<br>`npm run build`<br>`npm publish`|
|feature分支|从master上拉取的<br>用于开发新特性或者改bug的分支|不发布，feature分支都合入develop或master<br>只在develop或master上发布|

### master分支管理
只有一个人有**主仓库**master分支的写权限，其他人只能往master提merge request

### develop分支管理
**主仓库**develop分支用于处理MR和review代码；目前没有review的流程，所以每个人都有develop分支的写权限，可以自己合MR

### feature-xx分支管理
- 生成
```javascript
git pull upstream master:feature-xx
git checkout feature-xx
```

- 提交
```javascript
git commit -m '提交信息'
git push origin feature-xx
```

- 合入develop分支并解决冲突
```javascript
git checkout develop
git pull upstream develop
git merge feature-xx
解决冲突。。。
git push origin develop
往主仓库提MR。。。
```

### 发布
master的可以管理员自己命令行发版本<a href="#预期方案">上面表格中命令</a>

### 修复线上紧急bug发版流程
```javascript
git pull upstream master:hotfix-xx
git checkout hotfix-xx
改代码并提交。。。
git push origin hotfix-xx
从gitlab上hotfix-xx往master提MR
管理员合并MR并发版
```

## 存在的隐患
- 如果发布组件库并非一次成功，那么还是会产生废版本。比如当前版本是0.19.0-beta.10，发布正式版本后版本变成0.20.0，但一会儿发现要改点东西继续发，那么正式版本会变成0.21.0，这样中间的0.20.xx版本就是废版本
- ci运行效率低
- 发布流程变长了，之前每个人自己在master上拉代码，自己解决冲突再推到master。现在提要一个个按次序的解决冲突再提MR，管理员合并了一个人的MR后，另一个人才能开始处理
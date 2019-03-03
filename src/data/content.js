export default [
  {
    "excerpt": "你好；组件库开始发布啦\n",
    "tags": [
      "组件库",
      "markdown"
    ],
    "id": 0,
    "title": "yiwise-components组件库管理",
    "lastUpdated": "2019-02-28 21:01:03",
    "path": "/posts/%E7%BB%84%E4%BB%B6%E5%BA%93%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B.html",
    "strippedContent": " 你好；组件库开始发布啦    <!-- more -->    ## 关于版本号  [https://www.cnblogs.com/skylor/p/9675646.html](https://www.cnblogs.com/skylor/p/9675646.html)    ### 基本版本格式  1 | 主版本号（Major）.次版本号（Minor）.修订号（Patch）-先行版本号  -- | --    v0.20.0-beta.1     ## 前期处理方式及由此导致的问题    > 每改点东西就发个版本，并且只递增修订号：0.1.1，0.1.2 。。。0.1.XX，直到感觉修订号太大就手动递增次版本号，比如从0.1.60改成0.2.0     - 当线上出现bug需要修复时，没法知道应该改哪个版本。  > 为解决上述问题，加上tag机制和feature分支机制，即每开发一个新特性时，开一个新feature分支，每开一个新分支次级版本号加一，要测试时，直接从分支上发版本，并给版本加上tag和描述信息    <p><img src=\"https://github.com/zhouJiecode/notes/blob/master/1.PNG?raw=true\" alt=\"123\" width=\"379\" height=\"372\"></p>       - 这种方式导致的问题是：版本功能不连续，比如0.19.0可能不包含0.18.xx的特性，而发布之后感觉中间的次级版本都是废版本  > 在fork分支和master上都能发版本     - 在fork分支上发版本，tags只能在fork分支上看到，这导致追溯版本记录比较困难    ## 预期方案     仓库分两种：  - 主仓库 （发版本用）  - fork分支 （开发用）    存在三种分支：    |分支|用途|发布命令|  |:------|:---|:-----------|  |master|发布正式版本|**第一步 所有人<u>*在自己的fork分支*</u>上，将各自要发布的feature分支合入master解决冲突后，往<u>*主仓库master*</u>上提MR**<br>`git checkout master`<br>`git pull upstream master`<br>*`git merge feature-xx`<br>解决冲突。。。*<br>`git push origin master`<br>*到gitlab上从fork master往主仓库 master提MR*<br><br>**第二步 发布正式版本**<br>管理员处理好所有MR，然后执行以下命令<br>`git checkout master`<br>`npm version patch -m '发布正式版本'`<br>`git push origin master --tags`<br>`npm run build`<br>`npm publish`<br><br>**第三步 递增master分支次级版本号**（由管理员执行，改线上紧急bug发版时不需要这一步）<br>`npm version minor -m '递增master分支次级版本号'`<br>`git push origin master`|  |develop|主仓库：发布测试版本<br><br>fork分支：用于合入当前迭代所有代码并解决冲突，之后往主仓库develop提MR发布测试版本|`npm version prerelease --preid=beta -m '组件库发测试版本ttt'`<br>`git push origin develop --tags`<br><br>**以下两步由gitlab ci自动执行**<br>`npm run build`<br>`npm publish`|  |feature分支|从master上拉取的<br>用于开发新特性或者改bug的分支|不发布，feature分支都合入develop或master<br>只在develop或master上发布|    ### master分支管理  只有一个人有**主仓库**master分支的写权限，其他人只能往master提merge request    ### develop分支管理  **主仓库**develop分支用于处理MR和review代码；目前没有review的流程，所以每个人都有develop分支的写权限，可以自己合MR    ### feature-xx分支管理  - 生成  ```javascript  git pull upstream master:feature-xx  git checkout feature-xx  ```    - 提交  ```javascript  git commit -m '提交信息'  git push origin feature-xx  ```    - 合入develop分支并解决冲突  ```javascript  git checkout develop  git pull upstream develop  git merge feature-xx  解决冲突。。。  git push origin develop  往主仓库提MR。。。  ```    ### 发布  master的可以管理员自己命令行发版本<a href=\"#预期方案\">上面表格中命令</a>    ### 修复线上紧急bug发版流程  ```javascript  git pull upstream master:hotfix-xx  git checkout hotfix-xx  改代码并提交。。。  git push origin hotfix-xx  从gitlab上hotfix-xx往master提MR  管理员合并MR并发版  ```    ## 存在的隐患  - 如果发布组件库并非一次成功，那么还是会产生废版本。比如当前版本是0.19.0-beta.10，发布正式版本后版本变成0.20.0，但一会儿发现要改点东西继续发，那么正式版本会变成0.21.0，这样中间的0.20.xx版本就是废版本  - ci运行效率低  - 发布流程变长了，之前每个人自己在master上拉代码，自己解决冲突再推到master。现在提要一个个按次序的解决冲突再提MR，管理员合并了一个人的MR后，另一个人才能开始处理"
  },
  {
    "excerpt": "常用 Markdown 语法。\n",
    "tags": [
      "markdown"
    ],
    "id": 1,
    "title": "Markdown 语法",
    "lastUpdated": "2018-04-29 12:15:53",
    "path": "/posts/test-markdown.html",
    "strippedContent": " 常用 Markdown 语法。    <!-- more -->    ### 1. 斜体和粗体    使用 \\* 和 \\*\\* 表示斜体和粗体。    示例：    这是 _斜体_，这是 **粗体**。    ### 2. 分级标题    使用 === 表示一级标题，使用 --- 表示二级标题。    示例：    ```  这是一个一级标题  ============================    这是一个二级标题  --------------------------------------------------    ### 这是一个三级标题  ```    你也可以选择在行首加井号表示不同级别的标题 (H1-H6)，例如：# H1, ## H2, ### H3，#### H4。    ### 3. 外链接    使用 \\[描述](链接地址) 为文字增加外链接。    示例：    这是去往 [本人博客](/) 的链接。    ### 4. 无序列表    使用 \\*，+，- 表示无序列表。    示例：    * 无序列表项 一  * 无序列表项 二  * 无序列表项 三    ### 5. 有序列表    使用数字和点表示有序列表。    示例：    1.  有序列表项 一  2.  有序列表项 二  3.  有序列表项 三    ### 6. 文字引用    使用 > 表示文字引用。    示例：    > 野火烧不尽，春风吹又生。    ### 7. 行内代码块    使用 \\`代码` 表示行内代码块。    示例：    让我们聊聊 `html`。    ### 8. 代码块    使用 四个缩进空格 表示代码块。    示例：        这是一个代码块，此行左侧有四个不可见的空格。    ```js{4}  export default {    data () {      return {        msg: 'Highlighted!'      }    }  }  ```    ### 9. 插入图像    使用 \\!\\[描述](图片链接地址) 插入图像。    示例：    <!-- ![我的头像](~@pub/face.jpg) -->    ### 10. 删除线    使用 ~~ 表示删除线。    ~~这是一段错误的文本。~~    ### 11. 表格    | 项目   |   价格 | 数量 |  | ------ | -----: | :--: |  | 计算机 | \\$1600 |  5   |  | 手机   |   \\$12 |  12  |  | 管线   |    \\$1 | 234  |    ### 12. 自定义容器    **Input**    ```  ::: tip 提示  This is a tip  :::    ::: warning 注意  This is a warning  :::    ::: danger 警告  This is a dangerous warning  :::  ```    **Output**    ::: tip 提示  This is a tip  :::    ::: warning 注意  This is a warning  :::    ::: danger 警告  This is a dangerous warning  :::  "
  }
];
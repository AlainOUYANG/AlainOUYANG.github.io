---
layout:     post
title:      Python 字符串前面加 u, r, b 的含义

subtitle:
date:       2019-01-14
author:     AlainOUYANG
header-img: img/post-bg-kuaidi.jpg
catalog: true
tags:
    - Python
    - 2019
---

### u/U：表示 unicode 字符串

不是仅仅是针对中文, 可以针对任何的字符串，代表是对字符串进行 unicode 编码。

一般英文字符在使用各种编码下, 基本都可以正常解析, 所以一般不带`u`；但是中文, 必须表明所需编码, 否则一旦编码转换就会出现乱码。

建议所有编码方式采用 utf8。

### r/R：非转义的原始字符串

与普通字符相比，其他相对特殊的字符，其中可能包含转义字符，即那些，反斜杠加上对应字母，表示对应的特殊含义的，比如最常见的`\n`表示换行，`\t`表示 Tab 等。而如果是以 `r`开头，那么说明后面的字符，都是普通的字符了，即如果是`\n`那么表示一个反斜杠字符，一个字母 n，而不是表示换行了。

以`r`开头的字符，常用于正则表达式，对应着 re 模块。

### b：bytes

Python 3.x 里默认的 str 是（Python 2.x 里的）unicode, bytes 是（Python 2.x）的 str, `b`前缀代表的就是 bytes。

Python 2.x 里, `b`前缀没什么具体意义， 只是为了兼容 Python 3.x 的这种写法。

----
转载自：[SmallisBig 的博客](https://blog.csdn.net/u010496169/article/details/70045895)

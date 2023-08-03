---
layout:     post
title:      《These four “clean code” tips will dramatically improve your engineering team’s productivity》翻译
subtitle:   
date:       2020-01-17
author:     AlainOUYANG
header-img: img/post-bg-universe.jpg
catalog:    true
tags:
    - 2020
    - 翻译
---

# 这四个「写出整洁代码」的技巧将大大提高你的工程团队的生产力

> 本文是《These four “clean code” tips will dramatically improve your engineering team’s productivity》这篇文章的翻译版本，译者水平有限，若有纰漏，欢迎批评指正。

![Title Image](https://tva1.sinaimg.cn/large/006tNbRwgy1gb5b1u5fb0j30dw0clgmd.jpg)

几年前在 VideoBlocks，我们遇到了一个重要的代码质量问题：大部分文件中的「面条式」逻辑[^1]、大量的重复、缺少测试等等。编写新的特性甚至是对微小 bug 进行修改，最好的情况下都需要好几个 Tums 片[^2]、一整瓶的 Prpto-Bismol[^3] 以及苏格兰威士忌。我们 WTFs/min（每分钟 What The F**k 的次数）已经高上天了。

多亏了对代码质量的刻意注意，今天，我们的代码库的质量明显提高了。几年前（作者这里应该是在「A couple of years ago」中漏掉了「of years」），当我们注意到问题所在时，我们团队阅读了 Robert Martin 的《[代码整洁之道](https://book.douban.com/subject/4199741/)》，然后尽最大努力执行了他的建议，甚至把「整洁的代码」作为工程团队文化的核心支撑。我强烈建议你在开始拓展你的代码的时候同时做这两件事。长远来看，适当刻意去练习「整洁的代码」将会让生产力提高一倍，并显著提高工程团队的道德水平，如果有的选，谁愿意待在（图中）右边的房间呢？

在我们执行来自《代码整洁之道》和其他资源的建议时，有五条意见（实际上只有四条。。）帮助我们提高了至少 80% 的效率和团队幸福感。

1. 「如果没有做测试，那它就是坏的」
  多写测试，尤其是单元测试，不然你肯定会后悔。
2. 取有意义的名字
  变量、类和函数的命名应该简短而准确。
3. 类和函数应该尽量小，并遵守单一功能原则
  函数不要超过 4 行，类不应该超过 100 行。是的，你没有看错。它们也应做且只做一件事。
4. 函数不应该有副作用
  副作用（比如修改输入参数）是邪恶的。确保你的代码没有这些副作用。尽可能在函数契约[^4]中明确指出这些（例如，传入原始类型或没有 setter 的对象）。

让我们逐条细品，以便你可以理解并将它们应用到你在工程师团队的日常生活中。

## 1.「如果没有做测试，那它就是坏的」

我开始对我们的工程师一遍一遍地重复这句话，因为我们遇到了本不应该由测试测出的 bug。你也应该一遍一遍地重复这句话直到你建立起了「测试文化」。多写测试，尤其是单元测试。谨慎考虑集成测试，并确保你有足够多的测试来涵盖你的核心业务功能。请记住，如果一段代码没有被你的测试覆盖到，那么以后你很可能会污染这段代码，并且在你的客户遇到 bug 之前你绝不会察觉。

一遍一遍地向你的团队重复「如果没有做测试，那它就是坏的」，直到这个信息嵌进了团队的意识中。不管你是刚出学校的新晋软件工程师，还是富有经验的老手，都应该练习这个你重复讲的东西。

## 2. 取有意义的名字

> 计算机科学中只有两件难事：*缓存失败* 和 *命名*。-- Phil Karlton

你之前可能就听过这句名言，并且这也是与你在工程师团队中的日常生活最相关的了。如果你和你的团队并不擅长命名，那这会变成不可维护的噩梦，你也不能做成任何事。你会失去你最好的开发人员，而且你的公司很快就会倒闭。

严肃的说，朋友不会让他的朋友使用糟糕的变量名，像「data」、「foobar」或者「myNumber」，并且他们一定不会让这种朋友给类取像「[SomethingManager](https://blog.codinghorror.com/i-shall-call-it-somethingmanager/)」一样的名字。请确保你的命名简短而准确，如果不能同时做到，那么尽量准确即可。大力优化开发人员效率，并通过 IDE 中「find by name」的快捷键来轻松查找文件。通过代码审查严格地执行良好的命名。

## 3. 类和函数应该尽量小，并遵守单一功能原则

「小」和「单一功能原则」就像鸡肉和鸡蛋一样，美味可口。我们先来看「小」。

「小」对函数来说意味着什么？不超过 4 行代码。是的，你没有看错，4 行。你现在可能就要关掉这个标签页了，但你不应该这么做。这听起来有些武断而且太小了，你这辈子可能都从没写过这样的代码。然而，写一个 4 行的函数会强迫你去认真思考并好好为子函数命名，以使得你的代码自文档化。另外，这也意味着你不能使用太多嵌套的 IF 语句，因为那会让你花费很多的脑力来弄明白所有的代码路径。

让我们来看一个例子。Node 有一个 npm 模块叫做「build-url」，用于执行它名字所示的功能：它构建 URL。你可以在[这里](https://github.com/steverydz/build-url/blob/master/src/build-url.js)找到我们要看的代码的源文件。下面是相关代码：

```javascript
function buildUrl(url, options) {
    var queryString = [];
    var key;
    var builtUrl;

    if (url === null) {
      builtUrl = '';
    } else if (typeof(url) === 'object') {
      builtUrl = '';
      options = url;
    } else {
      builtUrl = url;
    }

    if (options) {
      if (options.path) {
        builtUrl += '/' + options.path;
      }

      if (options.queryParams) {
        for (key in options.queryParams) {
          if (options.queryParams.hasOwnProperty(key)) {
            queryString.push(key + '=' + options.queryParams[key]);
          }
        }
        builtUrl += '?' + queryString.join('&');
      }

      if (options.hash) {
        builtUrl += '#' + options.hash;
      }
    }

    return builtUrl;
};
```

注意到，代码有 35 行。理解起来并不难，但是如果我们应用「小」这一原则来提取辅助函数，则可能会更容易推断。下面是更新和改进的版本。

```javascript
function buildUrl(url, options) {
  const baseUrl = _getBaseUrl(url);
  const opts = _getOptions(url, options);

  if (!opts) {
    return baseUrl;
  }

  urlWithPath = _appendPath(baseUrl, opts.path);
  urlWithPathAndQueryParams = _appendQueryParams(urlWithPath, opts.queryParams)
  urlWithPathQueryParamsAndHash = _appendHash(urlWithPathAndQueryParams, opts.hash);

  return urlWithPathQueryParamsAndHash;
};

function _getBaseUrl(url) {
  if (url === null || typeof(url) === 'object') {
    return '';
  }
  return url;
}

function _getOptions(url, options) {
  if (typeof(url) === 'object') {
    return url;
  }
  return options;
}

function _appendPath(baseUrl, path) {
  if (!path) {
    return baseUrl;
  }
  return baseUrl += '/' + path;
}

function _appendQueryParams(urlWithPath, queryParams) {
  if (!queryParams) {
    return urlWithPath
  }

  const keyValueStrings = Object.keys(queryParams).map(key => {
    return `${key}=${queryParams[key]}`;
  });
  const joinedKeyValueStrings = keyValueStrings.join('&');

  return `${urlWithPath}?${joinedKeyValueStrings}`;
}

function _appendHash(urlWithPathAndQueryParams, hash) {
  if (!hash) {
    return urlWithPathAndQueryParams;
  }
  return `${urlWithPathAndQueryParams}#${hash}`;
}
```

你可能注意到了，我们并没有严格的执行「每个函数 4 行代码」的标准，而是创建了几个相对「小」的函数。每个函数都只做一件事，而这件事从函数的名称中就能很容易理解出来。如果你愿意，你甚至可以对这些函数进行独立的单元测试，而不是只能对巨大的 `buildUrl` 函数进行测试。你可能也注意到了，这种方法创造了稍微多一点的代码，从 35 行扩展到 55 行。这完全是可以接受的，因为这 55 行代码相对 35 行更容易维护，也更容易阅读。

你怎么做才能写出像这样的代码呢？我个人认为，写下完成你希望完成的任务所需要的步骤清单是最容易的。这些步骤中的每个步骤都可能是 sub/helper 函数的不错选择。例如，我们可以如下描述 `buildUrl` 函数：

1. 初始化 base URL 和 options
2. 添加 paths（如果有的话）
3. 添加 Query Parameters（如果有的话）
4. 添加 Hash（如果有的话）

仔细想想这些每一个步骤是如何几乎是直接转化为子函数的。一旦你养成了习惯，你会逐渐的开始使用这种自上而下的方法去编写所有的代码，在其中创建步骤列表，为函数打桩，然后就像这样继续递归到每个子函数中，创建步骤列表、打桩等等。

现在我们来说说我们相关的概念，*单一功能原则*。这意味着什么呢？下面是来自[维基百科](https://en.wikipedia.org/wiki/Single_responsibility_principle)的解释：

> The Single Responsibility Principle (SRP) is a computer programming principle that states that every module or class should have responsibility over a single part of the functionality provided by the software, and that responsibility should be entirely encapsulated by the class. All its services should be narrowly aligned with that responsibility.
> 单一功能原则是一个计算机编程中的原则，它规定每个模块或类都应该只有一个单一的软件中的功能，并且该功能应该由这个类完全封装起来。所有它的（这个类的）服务都应该严密的和该功能平行（功能平行，意味着没有依赖）。

Robert Martin 在《代码整洁之道》中给出了一个类似的定义：

> The SRP states that a class or module should one, and only one, reason to change.
> 单一功能原则规定，如要对一个类或模块进行修改，应该有且仅有一个原因。

我们假设现在我们要构建一个系统，这个系统读入某种类型的报告并展示出来。一个朴素的方法可能是：构建一个单一的模块/类，用来存储所有的报告数据、同时存储如何展示这个报告的逻辑。然而这违反了单一功能原则，因为有两种高级的原因来修改类。首先，如果报告字段发生更改，我们将需要对其进行更新。其次，如果报表可视化要求发生变化，我们将需要更新该类。因此，我们应该将这些概念和所有权区域划分为两个不同的类，例如 ReportData 和 ReportDataRenderer 或类似的类，而不是使用单读一个类来存储数据和渲染逻辑。

## 4. 函数不应该有副作用

副作用是非常邪恶的，并且它会使写出无 bug 的代码变得极其困难。看看下面这段代码，你能找出其中的副作用吗？

```javascript
function getUserByEmailAndPassword(email, password) {
  let user = UserService.getByEmailAndPassword(email, password);
  if (user) {
    LoginService.loginUser(user);  // Log user in, add cookie (Side effect!!!!)
  }
  return user;
}
```

这个函数正如它的名字所示，被设计来使用 email/password 组合来查找用户，是网页应用的一个常规操作。然而，作为一个并没有阅读这个函数的代码实现的使用者，你并不知道的是，这个函数有一个隐藏的副作用：它将用户登录，创建一个登录令牌，将其添加到数据库中，然后将 cookie 与值一起发送回给我们的用户，以便他们随后一直处于「登录状态」。

这有很多问题。

首先，不阅读代码实现就不容易理解功能协定/接口。即使记录了登录的副作用，这仍然是不理想的。工程师倾向于在现代 IDE 中使用 intellisense，因此不会认为他们需要基于简单的函数名来阅读文档。他们倾向于只使用该函数来获取用户对象，而没有意识到他们在请求中添加了 cookie，这可能导致各种有趣的难以发现的错误。

其次，考虑到所有依赖关系，函数测试相当具有挑战性。验证你可以通过 email/password 来查找用户是需要模拟 HTTP 响应的，以及处理对登录令牌表的写入。

第三，用户查找和登录之间的紧密结合会不可避免地无法满足将来的所有情况，在这种情况下，你可能需要单读地去查找或登录用户。换句话说，它不是「未来的证明」。

总而言之，请确保记住并应用以下四个「整洁代码」的原则以显着提高团队的生产力：

1. **「如果没有做测试，那它就是坏的」**
2. **取有意义的名字**
3. **类和函数应该尽量小，并遵守单一功能原则**
4. **函数不应该有副作用**

在稍后的博客文章中，我将介绍必然的设计模式，包括不变性、服务/工厂/价值对象（VO）的持久化等等。

[^1]: 面条式代码（Spaghetti code）是软件工程中反面模式的一种，是指一个源代码的控制流程复杂、混乱而难以理解，尤其是用了很多 GOTO、例外、线程、或其他无组织的分支。其命名的原因是因为程序的流向就像一盘面一样的扭曲纠结。面条式代码的产生有许多原因，例如没有经验的程序设计师，及已经过长期频繁修改的复杂程序。结构化编程可避免面条式代码的出现。
[^2]: 一种治疗消化道溃疡的咀嚼式制酸药片。
[^3]: 一种减轻上消化道溃疡症状的药物，主成分是次水杨酸铋。
[^4]: 契约式设计（英语：Design by Contract，缩写为 DbC），一种设计计算机软件的方法。这种方法要求软件设计者为软件组件定义正式的，精确的并且可验证的接口，这样，为传统的抽象数据类型又增加了先验条件、后验条件和不变式。这种方法的名字里用到的“契约”或者说“契约”是一种比喻，因为它和商业契约的情况有点类似。

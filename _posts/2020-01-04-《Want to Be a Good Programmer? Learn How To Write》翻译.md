---
layout:     post
title:      《Want to Be a Good Programmer? Learn How To Write》翻译
subtitle:   
date:       2020-01-04
author:     AlainOUYANG
header-img: img/post-bg-universe.jpg
catalog:    true
tags:
    - 2020
    - 翻译
---

# 想成为一个好程序员？学学如何写作吧

> 本文是《Want to Be a Good Programmer? Learn How To Write》这篇文章的翻译版本，译者水平有限，若有纰漏，欢迎批评指正。

![题图](https://miro.medium.com/max/11240/1*uRV0WZ6Fca_K9WmCvWjfng.jpeg)

不管你是有多年编程经验的程序员，亦或是你刚刚开始学习编程，如果你在读这篇文章，那么你已经有了另一门语言的技能：英语技能。

我下面要讲的就是，学会读和写会帮助你成为一个好的程序员。

扎实地掌握通过书面语言进行交流的技巧，可以让你掌握编程方面的一项重要技能，这项技能与计算机科学本身无关，而与表达思想有关。

## 我们把更多的时间花在读代码上，而不是写代码上

「代码不是写给电脑看的。」请将这句话写下来并画上下划线，并且每晚入睡前对你自己重复这句话：代码不是写给电脑看的。

的确，你写的代码（经过编译器、虚拟机、解释器，或者所有这些的编译）最终会变成被电脑执行的指令。

但看这段代码的不仅仅只有电脑。

当计算机阅读你的程序时，会将你的代码的模型放入内存和 CPU 寄存器中。

而当人类阅读你的代码时，他们会基于你的代码结构在脑海中建立起一个模型。

那些从没看过你的系统、对它所知甚少的人经常会略过文档直接看代码，因为代码才是我们描述软件运行方式的最佳抽象。

把你的代码看做两件并行的事：

1. 它是一系列机器可以执行的指令；
2. 它是为你代码未来的维护者所作的一篇结构化的文章。

## 软件开发中，软件的维护占了绝大多数成本

程序不是静态的东西，它们是有延展性的，非常灵活。它们随着新的产品需求、新的技术而改变，有时为了增加改动、有时当然也是为了修改 Bug。

在设计程序之前，我们很少编写程序的详细蓝图。正相反，在软件开发的过程中，设计通常是开发的一个结果，而不是反过来。

这样的设计过程永远也不会结束。即使软件的最初版本已经发布很久了，我们依旧会对它做一些改动。99% 的时间里，我们今天写的代码会在未来以某种方式被修改。我们将这称为「软件系统的维护」。

你的系统可能会成为一个复杂的生产系统，有数百名开发人员通过源代码控制每天贡献数十个提交。它也可能只是一个我们自己写的简单脚本，但几年之后我们也可能会去修改它。

在上述任何一种情况下，都会发生一些修改过程，其中一些是可预测的，而另外一些则不是。你或者你的团队进行修改的难易程度，就是系统的维护成本。

而这通常是最主要的成本。如果一个几十年前编写的笨重老旧的系统需要投入大量开发时间来修改，那么可能会使项目严重偏离轨道。对复杂、维护不良的旧系统的依赖可能会迫使我们去重构数据模型并进行昂贵的重写，只是为了避开棘手的代码。

简而言之，软件的维护成本变成了一个问题。

## 像作家一样编程

我知道你在想什么，不就是因为这个所以我们才需要文档的么？我们为类编写文档。我们有内联文档 UI，例如 Javadoc 和 Sphinx。有时我们甚至有专门负责技术文档的人员组成的部门。那不是使我们的代码更具有可维护性吗？

这当然有帮助，但那还不够。

以一种易于理解和可读的方式来构造代码已经远远超出了文档的范围。仅仅是记录项目中的每个类和函数并不会让你的代码具有可理解性。

如果你编写程序时不考虑设计模式，并且只是随意地给一些类添加了注释，那么你就没有编写可读的代码。

但是我不会给你列出需要遵循的设计模式，你完全可以根据自己选择的语言去搜索。

正相反，我希望你考虑一下是什么让英文作品具有可读性。好的作品往往具有以下这些特点：

1. 它不会使用很难的需要查词典才能理解的词，只要有的选，它都会使用一些更为简单的词。
2. 它是「面向读者的」。面向普通读者的技术文档会非常谨慎地定义行业术语或完全避免使用它们。恐怖小说则会遵循这种风格来取悦粉丝。
3. 它用尽可能用更少的词表达更多的意思。
4. 它不会跑题。如果它开始进入另一个相关主题，则可能会引用另一章或插入脚注，其中那个主题已经被适当地详细介绍过了。它不会没完没了地扯一些无用信息。
5. 富有表现力。作品的结构暗示了作品的广泛含义。它具有更广泛的意义。

所有这些规则都有着同一个目的，就是让读者了解主要的内容。好的写作可以避免干扰，让读者专注于交流的内容。

类似地，我们可以对一个好的程序代码给出同样的规则：

1. 当有更简单的选择时，它不会使用一般程序员不熟悉的函数库或 API；
2. 它会避免使用项目维护者不熟悉或者过于有挑战性的设计模式；
3. 简洁直接，没有花里胡哨的语法或技巧；
4. 通过模块和抽象，使模块尽量小并且仅做一件事，遵循 UNIX 中的「小、可堆叠」的概念；
5. 富有表现力。代码的模式直接体现系统的功能，程序的结构也是可预测的。一旦你了解了程序的结构，你也就知道了这个系统是如何工作的。

## 「可读的」意味着什么？

我们在谈论的代码表现力或可理解性时，常常会提到 *可读性* 的概念。*可读性* 究竟是什么意思呢？

对我来说，可读性意味着：

- 具有一般经验的人可以仅通过阅读代码来掌握项目并弄清楚其工作方式；
- 我自己可以在代码中解释模块的结构，以及解释在更大的程序中每个组件的目的。我喜欢以通过系统的数据流的形式来做这些解释（例如，一个函数调用从这里开始，调用了这个库，然后在那里结束）；
- 代码的结构会建议在哪里如何执行一个给定的更改。

可读性就是要降低编写代码的准入门槛。越容易阅读，就越容易进行更改。这解决了我们的维护成本问题。

## 我们为什么会忽略可读性？

我们倾向于过度关注代码的基本功能。解决困难的算法问题已经成为面试中的主要内容，而简历则更多注重于算法或面向数据的项目经历。

当然，我们的代码需要能运行，解决算法问题也富有挑战性。但仅仅让代码能跑还不够，这仅仅是最低要求。代码需要可读。

复杂系统的维护成本经常被忽略，这是我们倾向于忘记的烦人现实。然而这样做会带来危险。不可读的代码会让我们的系统生锈穿孔，随着时间的推移，系统会渐渐变慢直至戛然停止。我们需要小心修地补这些漏洞，并且需要对自己的代码进行设计以避免漏洞。

因此，我们应该更加重视阅读代码、以及通过重写部分代码来提高其质量的技巧。一个有趣的面试问题可能是提供一个有用的程序，然后要求面试者逐步对其进行重构，以提高其可读性。

## 可读性是修改出来的

为了解决这篇文章中出现的问题，我花了一些时间进行整理和重组。在发布之前，我还让一位文字编辑逐字重读了它。

我们应该对代码做同样的事。编程的时候，请确保你尽最大努力为你要解决的问题找到了正确的设计模式。确保你有严格的代码审阅过程，这不仅会发现缺陷，还会帮助我们确定可以在写代码时做出的可读性改进。

## 总结

用英语阅读和写作，以及阅读和写代码之间有很多重叠之处。

学习如何有效地阅读和写作，使我们能够根据听众的需求，通过选择最佳的措词和结构来更广泛地交流想法。

这种表达技巧也可以很好的应用在编程技艺上，所有程序员都应该注意培养这种技巧。

程序员的日常工作不仅仅涉及到数学运算和算法分析，更重要的是以一种允许其他程序员为你写的代码做出贡献的方式来解决问题。这意味着我们必须注意写出易于理解且维护成本低的代码。

而可维护的代码，我的朋友们，即是可读的代码。

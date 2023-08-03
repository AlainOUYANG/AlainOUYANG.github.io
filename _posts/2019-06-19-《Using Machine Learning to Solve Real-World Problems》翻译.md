---
layout:     post
title:      《Using Machine Learning to Solve Real-World Problems》翻译

subtitle:   
date:       2019-06-19
author:     AlainOUYANG
header-img: img/post-bg-universe.jpg
catalog: true
tags:
    - ARTS
    - 2019
---

# 《Using Machine Learning to Solve Real-World Problems》翻译

> 本文是《[Using Machine Learning to Solve Real-World Problems](https://blog.usejournal.com/using-machine-learning-to-solve-real-world-problems-97fb089d19ef?mc_cid=44d40569b7&mc_eid=c2ab58e995)》这篇文章的翻译版本，由于译者水平有限，欢迎批评指正。

参加 [Lambda School](https://lambdaschool.com/) 的培训已经十周了，我们已经完成了一个端到端的机器学习项目。这个项目是我们班内的一个时长一周的 Kaggle 竞赛项目，它使用[DrivenData.org](https://www.drivendata.org/competitions/7/pump-it-up-data-mining-the-water-table/page/24/)提供的水井数据。基于这些数据预测坦桑尼亚境内井水泵的工作状况与维修需要，以节省金钱时间和人力。

这个项目对我们目前为止学到的这些知识进行了一个测试：数据获取、数据探索、数据整理、建立模型、超参调整、模型验证、模型解释，以及数据可视化。这篇博客将会关注于模型解释。如果你对更多的技术细节感兴趣，你可以在[我的 GitHub 仓库](https://github.com/JLDaniel77/Water-Pump-Project)上找到我的 Notebook。

## 数据探索的结论

![](http://ww2.sinaimg.cn/large/006tNc79gy1g46iwvby2tj30d00g4wgo.jpg)

建立模型之后，我建立了一个重要度排序报告。这个报告显示了「水量」这个特征对模型有最大的影响。「水量」有 5 个种类：_充足_、_不足_、_干涸_、_季节性_和_未知_。如下图所示，我们可以看出，有超过 5000 个_正常工作_的水泵具有_足够_的水量。然而，有超过 2000 个水泵具有_足够_的水量，但是_未正常工作_。

![](http://ww1.sinaimg.cn/large/006tNc79gy1g46ix87sxej30l60cxgm5.jpg)

从上图我们也可以看出，_未正常工作_的水泵有着最高的「干涸」水源。这很容易理解，因为一口干井会被放弃和忽略。

![](http://ww1.sinaimg.cn/large/006tNc79gy1g46ixkfey6j30lm0d2wf3.jpg)

上图显示，超过 4000 个_未正常工作_的水泵有着「好的」水质。这 2000 个_有充足水量_的_未正常工作_的水泵中的某些或全部水泵，也可能含有可饮用的水。

![](http://ww1.sinaimg.cn/large/006tNc79gy1g46iy1ddpcj30m50dcaaj.jpg)

从上图我们可以看出，有接近 2000 个水质很好且水量充足的水泵_未正常工作_。很显然，这些水泵将会被优先考虑维修，但是，你如何知道哪一个水泵是第一个需要维修的呢？

你可以随机选择一批水泵然后查看每一个水泵是否需要维修。这看起来很合理，但是也可能完全是对时间和资源的浪费。事实上，基于下图训练数据中水泵状态的分布，我们得知我们有大约 46% 的机会正确地访问到一个_未正常工作_或_可以工作但需要维修_的水泵。这其实是一个恐怖的赔率。

![](http://ww2.sinaimg.cn/large/006tNc79gy1g46iyces8ej30c0039aa7.jpg)

## 我们如何改进结果？

我们需要建立一个预测模型来加强我们「基于新的数据正确分类水泵」的能力。通过有限的数据，我们不可能去查看所有的 14000 多个水泵，所以我们需要一个有的放矢的方法。

![](http://ww2.sinaimg.cn/large/006tNc79gy1g46iyiysryj30gy09smxy.jpg)

上面这两个表格一个是分类报告，一个是混淆矩阵。为了简洁起见，我结合了_未正常工作_和_可以工作但需要维修_的水泵的结论。分类报告展示了我们模型的准确率（precision）、召回率（recall）和 F1 值（f1-score）；混淆矩阵展示了我们模型的真正（true positive）、真负（true negative）、假正（false positive）和假负（false negative）的数量。

由下图可知，「准确率」是真正数量在预测正数量中的占比，「召回率」是真正数量在所有正数量中的占比。混淆矩阵显示，我们的模型正确地将 6805 个水泵预测为_正常工作_，正确地将 5030 个水泵预测为_未正常工作_。然而，模型也错误地将 1530 个_未正常工作_的水泵预测为_正常工作_，将 993 个_正常工作_的水泵预测为_未正常工作_。

「F1 值」是准确率和召回率的平均值。我们使用这三个指标来检测我们模型的准确性。

![](http://ww1.sinaimg.cn/large/006tNc79gy1g46iyqnaf9j30el0qj75b.jpg)

## 这如何与我们的实际情况相联系？

假设我们的资源只能支持我们访问并维修 2000 个水泵，我们要确保将维修人员只送到_未正常工作_的水泵处。我们运行我们的模型然后排列出我们的预测值，然后选择出 2000 个模型预测为_未正常工作_的水泵。

![](http://ww3.sinaimg.cn/large/006tNc79gy1g46iywtrr1j30bi09edg8.jpg)

从我们前 2000 个预测中，我们发现我们的模型正确地将 1982 个水泵预测为_未正常工作_；这是 99.1% 的准确率。与之前随机选择样本的只有 46% 的准确率的方式相比，如果我们基于随机方式派出维修人员，我们会将他们送到 1080 个并不需要维修的水泵处去。这完全是对时间、金钱和人力的严重浪费。使用预测模型，我们可以最小化我们的损失，同时最大化我们对资源的利用率。

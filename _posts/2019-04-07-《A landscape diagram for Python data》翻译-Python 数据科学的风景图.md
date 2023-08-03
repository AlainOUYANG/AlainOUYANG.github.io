---
layout:     post
title:      Python 数据科学的风景图

subtitle:   《A landscape diagram for Python data》翻译
date:       2019-04-07
author:     AlainOUYANG
header-img: img/post-bg-sample-image.jpg
catalog: true
tags:
    - Python
    - Data Science
    - Translation
    - 2019
---

> 本文是 [A landscape diagram for Python data](https://community.ibm.com/community/user/datascience/blogs/paco-nathan/2019/03/12/a-landscape-diagram-for-python-data) 这篇文章的翻译版本，由于译者水平有限，欢迎批评指正。

这篇文章介绍了一张「[风景图](https://higherlogicdownload.s3.amazonaws.com/IMWUC/UploadedImages/0d63eecd-fa76-4440-b4c0-a34a9e757e49/landscape.png)」，图中列举说明了当下最流行的 50 个左右 Python 库和数据科学框架。风景图展示了技术栈中的各个部分和他们的互补技术。换句话说，「零件是怎么组合起来的？」

举个例子，IBM 赞助的一些项目适用于数据科学工作中哪些大型开源 Python 的生态系统呢？[Jupyter Enterprise Gateway](https://blog.jupyter.org/introducing-jupyter-enterprise-gateway-db4859f86762) 就是一个很好的例子，它弥补了 [Project Jupyter](https://jupyter.org/) 和 [Apache Spark](https://spark.apache.org/) 之间的差距，并允许 Jupyter notebook 在企业级集群计算上运行。

![A landscape diagram for Python data](https://higherlogicdownload.s3.amazonaws.com/IMWUC/UploadedImages/0d63eecd-fa76-4440-b4c0-a34a9e757e49/landscape.png)

这张风景图提供了非常有用的信息，帮助我们概念化和讨论复杂的技术主题。随着 Python 生态系统的发展，保持这个图表的策划和更新非常重要。我们会这样做的。

注意：尝试将大量复杂的互连部件组合成整齐且格式化的二维网格是一项挑战。任何图表都必须“模糊定义的界限”以简化说明，这些定义之后可以详细讨论。一方面，这张风景图不包括极其详尽的列表。我们选择了广泛使用的流行的标准库，但也不得不舍弃一些相对不那么常用的。例如，我们没有讨论各种音频处理库，这些库用于语音到文本的识别任务。另一方面，我们来谈谈这个吧！如果您有关于任何更新的建议，请告诉我们。我们将在这里建立一个讨论论坛。

## 基础
为什么是 Python 呢？目前来看，Python 已经成为数据科学工作中的通用语。这门语言学习起来相对容易，并且有非常多的开源框架和库可以实现任何你的需求。如果没有的话，开发一个新的框架也非常容易。在构建 Web 应用、操作等方面，Python 也正变得的越来越受欢迎，所以它也非常适合于将数据科学的项目集成到大型应用环境上去。虽然其他的语言比如 R、Java 和 Scala 同样也适用于数据科学工作，但是还是让我们先关注一下 Python 吧，否则这个风景图会变得非常拥挤。

我们来谈论一下版本吧。2.x 版本和 3.x 版本的 Python 之间存在着非常大的差距，如果你刚刚开始使用 Python 编程，我建议你从 Python 3.x 开始，除非你的公司仍然需要 Python 2.x —— 确实有一些公司会需要 2.x 版本，并且这些原因是不同而且复杂的。然而如果你有机会从[最新稳定版本](https://www.python.org/downloads/)开始（目前是 Python 3.7.1），那将是最好的选择。

如果你只是刚开始学习 Python 编程，这里有两个非常受欢迎的推荐课程：
- Jessica McKellar 的 [_Introduction to Python_](https://www.oreilly.com/library/view/introduction-to-python/9781491904794/)
- Allen Downey 的 [_Think Python_](https://greenteapress.com/wp/think-python-2e/)

你可能也听过某些 Python 开发者谈论被称为「[PEP8](https://www.python.org/dev/peps/pep-0008/)」的东西。这是 Python 编码的最新风格指南，它提供了很好的建议以及许多有用的例子。[这个文档](https://www.python.org/doc/)提供了许多一般情况下的编码示例。

Python 的原作者 Guido van Rossum 指出，「代码被阅读的频率远远高于被写出来的频率」，所以可读性就成为了 Python 语言的一个核心方面。Allen Downey（上面引用的作者）发现，Python 的可读性给它带来了独特的性质。举例来说，如果你对在学术文献中描述算法的 *伪代码* 比较熟悉，那么 Downey 已经展示了[比同等伪代码更加简洁的 Python 实现](https://blogs.scientificamerican.com/guest-blog/programming-as-a-way-of-thinking/)。简介、可读的代码的使用为数据科学团队带来了很多的方便，人们需要理解彼此的代码并且能够复现结果。

## 包管理
风景图最底部的一层是 *包管理*。换句话说，是如何安装和更新你将需要的 Python 库。

Python 为此有两个推荐的选项：
- _pip_：一个通用的 Python 包管理器，使用 [PyPi](https://pypi.org/) 包索引的「官方」管理器
- _conda_：跨平台的环境管理器，与语言无关，使用 [Anaconda](https://www.anaconda.com/what-is-anaconda/) 发行版

请注意，[_pip_](https://packaging.python.org/tutorials/installing-packages/) 和 [_conda_](https://conda.io/docs/) 是两个完全不同的工具，用于非常不同的目的，只是它们两个恰巧共同拥有 Python 的包管理功能——而且他们在这个目的上是几乎相同的。几年前我可能说过「conda 在学术研究人员中更受欢迎，而 pip 在生产工作中更受欢迎」这种话，但现在已经不再是这样了。如果你的组织要求你使用其中的一个或另一个，那么最好根据要求来，两个混着用可能会导致问题。另见 Jake VanderPlas 在「[Conda: Myths and Misconceptions](https://jakevdp.github.io/blog/2016/08/25/conda-myths-and-misconceptions/)」中对这两个工具的精彩讨论。

选择好包管理器之后，接下来我强烈建议在开始安装各种库之前使用 *虚拟环境*。换句话说，创建一个具有自己安装目录的环境，以避免修改其他环境中被依赖的 Python 库。根据你自己的项目不同，你有可能会同时激活几个不同的虚拟环境。

如果你正在使用 *conda*，那么它自己就有[设置虚拟环境的功能](https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/)。而 *pip* 则有多个选择。有关所有的细节，请见 Colin Carroll 的 「[Improved Workflows With Isolated Jupyter Environment](https://www.dropbox.com/s/04dyvo8eifsi8nz/Colin%20Carroll.key?dl=0)」——尤其是幻灯片的第 11-14 页。我建议使用 _[virtualenv](https://virtualenv.pypa.io/)_，它运行良好，并且网上有非常多的示例。

目前在我的笔记本上我使用 _pip_ 和 _virtualenv_ 并且为不同的项目在四个 Python 虚拟环境中来回切换。我的大多数编码示例都会展示如何使用它们，但这些示例也可以转换为 _conda_。

说到管理库，请查看 [libraries.io](https://libraries.io/)，它会自动跟踪代码库所依赖的包，甚至可以跟踪许多不同的包管理器或语言。

## 应用框架
在底层的上面一层，让我们来思考一下如何运行 Python 应用。代码必须在某处运行。你的数据科学的工作很可能对 _安全、数据隐私、资源管理、监控等等_ 都有很高的要求。在企业环境中，在这些合规性要求下运行代码是很有挑战性的。

当然直接在命令行中运行 Python 程序是一个很简单的方式，对于个人的开发/测试来说有可能没问题，但是，当你需要与人合作，你的代码需要在生产环境中运行的时候，你还有其他的选择。这些选择也有助于并行工作负载，因为某些用例可能处于规模和速度需要多个服务器。

[_Apache Spark_](https://spark.apache.org/) 是数据科学工作流中最受欢迎的框架，使用 [_PySpark_](https://spark.apache.org/docs/latest/quick-start.html) 运行 Python 代码也是非常容易的。你可以在 PySpark 的 _独立模式_ 下执行 Python 代码，即从笔记本的命令行或者一个可以帮助并行化工作负载的 Spark 集群上运行。

[_Project Jupyter_](https://jupyter.org/) 在管理数据科学工作流中也非常受欢迎，「Python」是它的名字「Jupyter」中「py」的部分。Peter Parente 追踪了 Github 上[公共的 Jupyter notebook 的数量](http://nbviewer.jupyter.org/github/parente/nbestimate/blob/master/estimate.ipynb)，这个数字最近超过了三百万。Jupyter 为编辑代码、可视化结果和编辑文档提供了很多方式——所有这些方式都是在同一个文档中。你的同事可以重新运行你的 notebook 以重复你的分析，或者他们可能调整它以适应于其他的数据来源、不同的参数等等。[_JupyterLab_](https://jupyterlab.readthedocs.io/) 现在是编辑和运行 notebook 的推荐方式。

虽然不是严格的 Python 库，但如果你想让很多（数千？）人在你的组织中运行同样的 notebook，[_JupyterHub_](https://jupyterhub.readthedocs.io/) 提供了很多生成和管理并发实例的方法。

[_Jupyter Enterprise Gateway_](https://jupyter-enterprise-gateway.readthedocs.io/) 为由 Jupyter 构建的工作流提供了企业级的资源管理。数据科学团队可以利用分布式资源并显著地扩展并行内核数的上限。通过增加企业级的安全性，任何在工作流中使用 JupyterLab 的团队都有潜在的可用性。它的构建是利用大数据工具和分布式资源、企业安全性，同时包括  _JupyterLab_ 的所有 UX 和集成功能等。

Spark 和 JupyterHub 等分布式框架倾向于使用过多的系统工程开销。 Spark 使用 Scala，而且有时候会需要 [JVM tuning](https://docs.oracle.com/cd/E13222_01/wls/docs81/perform/JVMTuning.html) 来突破系统性能的瓶颈。此外，_PySpark_ 需要使用特使的数据集来完成规模和并行特性。通常这并不能够直接被转换为 Python 通用的分析建模库——这也就意味着你可能需要重构你的代码以便他们能高效地跑在 Spark 上面。

另一些选择并不需要过多的开销，并且能在规模上运行 Python 代码，同时要求更少的代码重构。[_Dask_](http://docs.dask.org/en/latest/why.html) 是一个常用的并行工作负载的 Python 库，它可以扩展到 HPC 超级计算机上——或者只是在笔记本上运行。它遵循与用于分析和建模的流行 Python 包相同的语言和数据结构，例如 _NumPy_ 和 _scikit-learn_。[_PyWren_](http://pywren.io/) 提供了相似的方法来在[无服务器的云 API](http://pywren.io/pywren_backends.html) 上扩展 Python 代码，而无需重写数据结构或管理集群，并且它被证明对于在构建完整管道时可能过度的临时查询很有价值。

[_Ray_](https://rise.cs.berkeley.edu/projects/ray/) 是另一个分布式的 Python 框架，来自 UC Berkeley 的 RISElab 实验室，被用于 _多智能体强化学习_。但实际上，这个框架有更多的意义：它几乎被认为是来自同一个实验室五年后的「下一代的 Spark」——这次是以先进的机器学习为核心。强化学习的大型生产用例开始在工业界中浮出水面，请继续关注，你会很快听到更多相关信息。

有时候，数据科学项目会以 _微服务_ 的方式运行，或者提供 [OpenAPI 集成](https://www.openapis.org/)，或者出于其他的某些原因被构建为 Web 应用。很显然，使用 [_Docker_](https://www.docker.com/) 和 [_Kubernetes_](https://kubernetes.io/) 组合来管理基于 _容器_ 的微服务架构现在已经受到了非常多的关注。虽然使用 [Jupyter Kernel Gateway](https://jupyter-kernel-gateway.readthedocs.io/) 来展示一个简单的基于 Jupyter 的微服务是可行的，但你可能仍然需要迁移到其他 Web 框架以实施大规模服务，以及满足企业中的其他性能或合规性问题（请参阅下一节中的更多相关信息）。[_Flask_](http://flask.pocoo.org/) 是一个流行的 Python 「微框架」，它非常易用。[_Gunicorn_](https://gunicorn.org/) 是一个与 WSGI 兼容的 HTTP 服务器，可以快速（3 行 Python 代码）与 _Flask_ 集成。即是：_Gunicorn_ 是一个将 _Flask_ Web 应用程序直接插入高性能、高安全性的 Web 服务器框架（如 [_Nginx_](https://www.nginx.com/)）的好方法。即使对于更复杂的环境，这也是将数据科学工作融入组织开发实践（例如安全措施、负载平衡、边缘缓存等）的好方法。

## 网络资源
往上一层，有时你会需要与网络资源集成。你可能需要提供数据、消费数据，或者与其他应用分项数据？

[_PyArrow_](https://arrow.apache.org/docs/python/) 是一个 [Apache Arrow](https://arrow.apache.org/) 的 Python 绑定。它相对来说比较新，提供了一个「内存数据的跨语言的开发平台…为在现代硬件上进行高效的分析操作而组织」。例如，你可能在 Node.js 应用程序中收集了大量的数据，并在其中运行分析 [Spark Streaming](https://spark.apache.org/streaming/)，以及 Python 中的其他报告…对于 IoT 应用来说，这是一个非常合理的场景。_PyArrow_ 允许您在不同的技术之间共享数据，_零拷贝_；应用程序直接共享彼此的内存，超级快速、高效。_PyArrow_ 已经集成到 Spark 中。

[_Scrapy_](https://scrapy.org/) 是一个非常流行的用于 Web 爬取的 Python 框架。举个例子，你可能需要抓取数百万个网页并从中收集数据，以创建自定义搜索引擎。[_Requests_](http://docs.python-requests.org/) 库提供了一个非常受欢迎的 API 来发出 Web 请求——这是一个比 _Scrapy_ 更为常见的情况——并且它非常容易使用。如果你需要调用 API 来获取数据，运行机器学习模型等，我强烈建议使用。_Requests_ 的口号是个有力的证明：

Requests 是 Python 中唯一一个 Non-GMO 的 HTTP 库，人类可以安全使用。

[_Flasgger_](http://flasgger.pythonanywhere.com/) 却截然相反，当你需要为你的数据科学工作 _发布_ 一个 API 时，Flasgger 是为在 _Flask_ 上运行的 Web 应用发布 [OpenAPI specs](https://www.openapis.org/) 和 [Swagger 工具](https://swagger.io/)的简单方法。也就是说：从你的 Python 代码中创建自文档化的 API，人们可以在浏览器中测试它们的集成效果。一个简单的例子：试验在我的网站上运行 /api/v1/info 端点 [https://derwen.ai/apidocs/](https://derwen.ai/apidocs/)。

[_Istio_](https://istio.io/) 提供了一种部署内部微服务的方法，对于扩展、安全性、监控等具有企业级的管理能力。即，数据科学团队可以创建出让开发团队喜欢的应用。

注意，_Flask_ + _Gunicorn_ + _Flasgger_ + _Istio_ 非常适合于把 Python 的数据科学应用转换为大规模部署的企业级微服务。即，快速将机器学习模型投入生产只需要很少的额外代码，同时也可以保持运营团队的满意度。

## 数据访问
数据科学的第一步：准备好你的数据。数据科学的第二步：返回并花更多时间准备好数据。面对现实吧，你花费了大量时间在准备数据、访问数据、加载数据等工作上。我们可以在这一层写出非常多的东西，因为许许多多大数据工具和数据科学平台经常关注这一层。我们已经知道像 Spark 这样的工具会在 ETL 中起到作用并帮助加载来自多种格式的数据（译者注：ETL，是英文 Extract-Transform-Load 的缩写，用来描述将数据从来源端经过萃取、转置、加载至目的端的过程。ETL 一词较常用在数据仓库，但其对象并不限于数据仓库），让我们考虑一些你可能需要自己编码的其他流行的数据访问方法/框架吧。

[_SQLAlchemy_](https://www.sqlalchemy.org/) 是一个用于从 Python 访问 SQL 数据库的流行的「瑞士军刀」。它支持各种不同的数据库平台和特性。SQLAlchemy 被设计成 DBA 友好型，是一个功能齐全的 ORM（object-relational mapper 对象关系映射器），非常适用于需要与 Java 数据库框架集成的任务——类似于 J2EE + Hibernate 工具包。

[_Pillow_](https://pillow.readthedocs.io/) 通过 Python Imaging Library 提供图像处理的功能。视频和图像数据是目前最受欢迎的深度学习数据源。这是一种阅读图像文件的流行方式。

[_BeautifulSoup_](https://www.crummy.com/software/BeautifulSoup/) 是读取 HTML 和 XML 文档最流行的包之一。它对 HTML 中的格式错误容错率很高，而实际上大部分的网页也确实如此。_BeautifulSoup_ 还可以自动将文档转换为 Unicode，因为这一点，它就应该获得诺贝尔奖。一旦你为你的 NLP 项目抓取了数百万个网页，就可以使用 _BeautifulSoup_ 将 HTML 标记转换为 NLP 库可以解析的文本数据了。

## 数据表示
我们向上移动到 _数据表示_ 这一层——在将数据加载到数据科学工作流程之后，它需要在某个地方「生存」，最好是在高效的数据结构中。粗略地说，_特征工程_ 就经常使用在这一层。根据使用情况和涉及的数据类型，有几种流行的选择。

[_Pandas_](http://pandas.pydata.org/) 可能是现存 _最彻底的数据科学的_ Python 软件包。如果我们的风景图只显示一个矩形，那么该矩形就是「_Pandas_」。Wes McKinney 的 [_Python for Data Analysis_](http://shop.oreilly.com/product/0636920050896.do) 提供了有关 Pandas 的所有细节。一旦您访问到了数据——通过 SQL 查询、读取图像文件、抓取 HTML 页面等——然后在工作流的下一个阶段之前，在 _Pandas_ 中对数据进行切片和切块，即用于可视化、报告、特征工程、建模、评估等。

就在 _Pandas_ 库旁边，[_NumPy_](http://www.numpy.org/) 是「用 Python 进行科学计算的基础包。」换句话说，_NumPy_ 是 Python 数据科学的主力工具包。请注意，在数据科学和机器学习中，我们所做的大部分工作都使用大型数组和矩阵，实际上是反复执行计算大量的 _线性代数_。_NumPy_ 为许多线性代数问题提供了高度优化的数据结构。

有时候大数据会因为数据量太大而无法展现自己的优势。例如，如果你需要计算数十亿个项，将一个非常庞大的数字除以另一个非常庞大的数字，这可能会产生不必要的处理性能瓶颈。如果你的最终结果是计算比率，并且你只需要一些有效数字，例如在 95％ 的置信区间内，那么你真正执行的计算量至少比所需要的计算值高两个数量级（近似）。正如他们在 Twitter 上所说的那样——_概率数据结构_ 成为大数据工作的一个重要优势——「哈希，而不是采样。」[_datasketch_](https://github.com/ekzhu/datasketch) 库在 Python 中为 _概率数据结构_ 提供了一些更好的实现方式。例如，查看我的同名[教程](https://www.oreilly.com/learning/probabilistic-data-structures-in-python-new)。作为 _NumPy_ 的替代和补充，这对于特别是 NLP 应用和一般的 _特征工程_ 非常有用。

[_Modin_](https://modin.readthedocs.io/) 是 _Ray_ 上的 _Pandas_。换句话说，Modin 通过仅仅更改一行代码来扩展 _Pandas_ 的工作流程。同样，这基本上是 _五年后的下一代 Spark_——再加上 _Ray_ 对于数据科学的 Python 库来说更为惯用。

移到图表的 NLP 区域，[_spaCy_](https://spacy.io/) 的好处实在太多。如果你需要在 Python 中进行自然语言的工作——例如文本分析——请使用 _spaCy_。它是 Python 中最先进、最快、最流行的 NLP 软件包，并且它也与其他软件包相得益彰。请注意，_spaCy_ 是一种「专横的API」，也就是说它只包含了它的作者所需的内容，但不包括所有需要的东西。

[_NLTK_](https://www.nltk.org/) 来自上一代的 Python 自然语言库。与 _spaCy_ 相反，通常 _NLTK_ (a) 较慢，(b) 不太先进，(c) 不仅包括厨房水槽，还包括堆叠在其他厨房水槽内的许多厨房水槽（指代码复杂）。即便如此，你仍会遇到许多仍然使用 _NLTK_ 的代码。

[_RDFLib_](https://rdflib.readthedocs.io/) 是一个用于处理 RDF、OWL 和其他语义 Web 格式的 Python 库。即，如何在 _知识图谱_ 中进行读取和写入。请注意，RDF 来自十多年前的早期 AI 工作。技术可能已经发展，但数据格式仍然有些标准化。知识图谱是一个趋势，因为它们提供了一些好方法，用以添加容易被深度学习方法遗漏的一些上下文。

## 分析和建模
向上移动一层，既然我们已准备好了数据，执行了特征工程并转换了数据，那么它已准备好去训练机器学习模型或运行其他类型的分析了。

[_SciPy_](https://www.scipy.org/) 是「科学计算的基础库」。因此它横跨了我们的风景图中的两层：一方面，_SciPy_ 提供数值分析、高级线性代数、以及用于科学计算的全系列 Python-atop-FORTRAN 代码；另一方面，_SciPy_ 包含了用于读取特殊格式的功能，例如图像文件。一般来说，它能与 _NumPy_ 很好地匹配。

[_scikit-learn_](https://scikit-learn.org/stable/) 算法家族可以说是 Python 上最流行的机器学习库。它很好地夹在下面的 _Pandas_ + _NumPy_ + _SciPy_ 和上面的 _Matplotlib_ 之间。坦率地说，我使用 scikit-learn 比任何其他机器学习库更多。有关优秀（且非常受欢迎）的指南，请参阅 Aurélien Géron 的 [_Hands-On Machine Learning with Scikit-Learn and TensorFlow_](http://shop.oreilly.com/product/0636920052289.do)。

[_StatsModels_](https://www.statsmodels.org/stable/index.html) 是 Python 中的通用统计软件包，它通常与 _NumPy_ 一起使用。结果使用现有的统计软件包进行测试，以确保正确性。我特别喜欢他们文档中的「[陷阱](https://www.statsmodels.org/stable/pitfalls.html)」和「[示例](https://www.statsmodels.org/stable/examples/index.html)」部分。

_深度学习_ 的使用已经变得如此普遍，Python 有一些最流行的框架：
- 谷歌的 [_TensorFlow_](https://www.tensorflow.org/)，这是最流行的方法
- [_Theano_](http://deeplearning.net/software/theano/)，去年停止了开发，但仍被广泛使用
- [_Keras_](https://keras.io/) 在 _TensorFlow_ 和 _Theano_ 上提供了一个易于使用的抽象层
- 来自 Facebook 的 [_PyTorch_](https://pytorch.org/)，其用户稳步增长

[_AllenNLP_](https://allennlp.org/) 建立在 _PyTorch_ 之上，为 NLP 问题提供深度学习解决方案。提示：这个研究项目与基于 _TensorFlow_ 的研究相互竞争，有时他们会在几周之内发表论文，以获得基准测试结果的第一名。

作为 Python 中比较流行的 NLU（_natural language understanding_ 自然语言理解）库之一， [_Rasa_](https://github.com/RasaHQ/rasa_nlu) 获得了大量关注。它对于分类意图特别有用——换句话说，构建聊天机器人和语音应用。你可以根据用例在 _spaCy_，_scikit-learn_，_TensorFlow_ 和其他基本 NLP + ML 技术上构建管道。

[_Gensim_](https://radimrehurek.com/gensim/) 是另一个用于 Python 中 _主题建模_、_矢量嵌入_ 和相关文本挖掘算法的流行库。

转移到风景图的图区域，[_NetworkX_](https://networkx.github.io/) 获得了我对 Python 数据科学工作中「最不被重视，然而稳操胜券」的库的投票。它提供了一个用于在内存中创建、操作和分析图的包。坦率地说，图数据库往往会妨碍严格的图算法工作，特别是对于大规模的知识图谱工作。_NetworkX_ 允许你在内存中处理大型的图、自定义图算法以及为你的用例进行分析，通常比图数据库框架更快，也更灵活。如果你需要创建知识图谱，请将 _NetworkX_ 视为一个出色的工具吧。

[_PyMC3_](https://docs.pymc.io/) 为贝叶斯统计建模、概率编程、高级机器学习算法等提供了一个流行的 Python 包。如果你需要运行 [_MCMC_](https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo)，你可能已经熟悉了 _PyMC3_。

[_Airflow_](https://airflow.apache.org/) 是一个 Python 框架——来源于 Airbnb--用于构建、运行和监视工作流。有趣的是，_Airflow_、_AllenNLP_、_TensorFlow_、_Rasa_ 等正在开始定义另一个用于编排管道和工作流程的新兴的一层。

## 可视化
向上移动到 _可视化_ 层：获取数据了？（检查），有功能了？（检查），有型号了？（检查），现在你需要查看结果，以评估你的分析和建模工作。有关其中一些软件包的理论详情，请参阅 Leland Wilkinson 的 [_Grammar of Graphics_](https://www.amazon.com/Grammar-Graphics-Statistics-Computing/dp/0387245448) 一书。

风景图中列出了 Python 中六个最流行的通用可视化库，因为技术栈的这一部分在数据科学中尤其重要：

- [_Matplotlib_](https://matplotlib.org/)，可以说是最广泛使用的，虽然对于「门外汉」来讲，有时候有点难以理解
- [_Seaborn_](https://seaborn.pydata.org/)，一个基于 _Matplotlib_ 的抽象层，可以生成漂亮的图形，更易于使用
- [_Altair_](https://altair-viz.github.io/)，一个声明式的统计可视化库，更简洁，更易于理解
- [_Bokeh_](https://bokeh.pydata.org/)，专为网页上的交互式数据可视化而构建（例如 _Jupyter_）
- [_plotnine_](https://plotnine.readthedocs.io/)，也是声明式的，_ggplot2_ 的 Python 实现
- [_Plotly_](https://plot.ly/online-chart-maker/)，一个交互式 [D3 charts](https://plot.ly/online-chart-maker/) 的在线编辑器

如果你的数据可视化需要表示为地图怎么办？换句话说，如果你正在处理地理空间数据，该怎么办？[_Cartopy_](https://scitools.org.uk/cartopy/docs/latest/) 是 _Matplotlib_ 的一部分，你可以用它绘制基本的地图层（形状等），在这之上你又可以绘制其他分析和可视化的层。[_GeoPandas_](http://geopandas.org/) 扩展了 _Pandas_，可以有效地利用地理空间数据，支持 [_Shapely_](https://shapely.readthedocs.io/) 绘图。[_Rasterio_](https://rasterio.readthedocs.io/) 渲染 _栅格_ 数据，例如卫星图像。

回到图的图形区域，[_Pydot_](https://pypi.org/project/pydot/) 是一个适配 [_GraphViz_](https://www.graphviz.org/) 的 Python 库。_Pydot_ 与 _NetworkX_ 搭配很好。在 NLP 用例和知识图谱工作中尤为方便。

## 可解释性、公平性、偏见、伦理
在风景图的顶层，我们展示了一组 Python 包，用来处理机器学习模型的 _可解释性_，并解决数据科学中的 _公平性_、_偏见_ 和 _道德问题_。

[_AIF360_](https://developer.ibm.com/code/open/projects/ai-fairness-360/) 更正式地称为 IBM 的「AI Fairness 360 toolkit」。这可以检测进入机器学习管道的不需要的偏差，并有助于减少这些偏差。

[_Skater_](https://datascienceinc.github.io/Skater/overview.html) 提供了用于机器学习模型解释的 Python 包。它根据多种策略构建，包括 [_LIME_](https://github.com/marcotcr/lime)、贝叶斯规则列表（Bayesian rule lists）和深度学习模型解释器（deep learning model interpreters）。

[_deon_](http://deon.drivendata.org/) 是一个数据科学家的道德检查表。它可以简单地集成到 Git 代码库中，并且可以用作数据科学团队工程流程的一部分。

[_Aequitas_](https://dsapp.uchicago.edu/projects/aequitas/) 是一种用于机器学习模型用例风险评估的偏见审计工具。

## 总结
好了，这是 Python 中数据科学的旋风之旅。虽然许多数据科学项目可能只使用了这些库中的一小部分，但希望引入的一些新功能和技术有助于你的实践。

同样，这是一个讨论的基础，我们将以此建立一个论坛以进行更多讨论。这个风景图是一个众所周知的「版本 1.0」，所以特别地，让我们讨论一下如何建议改进这个风景图怎么样？

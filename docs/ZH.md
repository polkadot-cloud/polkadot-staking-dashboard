# 欢迎使用Polkadot Cloud质押平台！

本文档旨在帮助开发者熟悉Polkadot Staking Dashboard. 若对文档内容有任何疑问，请联系 __staking@polkadot.cloud__.

## 提交Pull请求

本项目遵循 Conventional Commits规范. Pull请求将以squashed合并方式处理，并使用PR标题作为提交信息。提交信息需符合以下结构:

```
<类型>(<范围>): <摘要>
```

PR标题示例:

- feat: implement help overlay
- feat(auth): implement login API
- fix: resolve issue with button alignment
- fix(docs): fix installation section to README

**chore**类型的提交不会出现在版本更新日志中，适用于默认更新.

如需了解更多Conventional Commits规范，请访问[Conventional Commits website](https://www.conventionalcommits.org/).

## 版本发布

我们使用[Release Please](https://github.com/googleapis/release-please)自动化生成各软件包的更新日志和版本发布.

该工具是由Google维护的GitHub Action，可自动生成CHANGELOG、创建GitHub版本发布及版本号更新. [[Gtihub docs](https://github.com/googleapis/release-please), [Action](https://github.com/marketplace/actions/release-please-action)]

## URL参数

通过URL参数可引导用户进入特定应用配置。URL参数优先级高于本地存储值，将覆盖当前配置.

当前支持的URL参数包括:

- **n**: 访问时默认连接的网络
- **l**: 访问时使用的语言
- **m**: 访问时使用的模式（"simple"或"advanced"）
- **a**: 访问时连接的账户（若用户未导入该账户则忽略）

示例：以下URL将加载Kusama网络并使用中文界面:

**staking.polkadot.cloud/#/overview?n=kusama&l=zh**

## 添加验证人运行商

提交PR至[**@w3ux/w3ux-library**](https://github.com/w3ux/w3ux-library/tree/main)即可添加验证人运行商. 添加后该运行商将出现在**@w3ux/validator-assets** NPM包中. [完整指南](https://github.com/w3ux/w3ux-library/tree/main/library/validator-assets).

## 演示

- 29/06/2023: [[视频] Polkadot Decoded 2023: The Next Step of the Polkadot UX Journey](https://www.youtube.com/watch?v=s78SZZ_ZA64)
- 30/06/2022: [[视频] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)

## 仓库迁移记录

**17/06/2024:** Moved from **paritytech/polkadot-staking-dashboard**

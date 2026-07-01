# Moodio Browse — Performance Challenge

## Setup

```bash
cp .env.local.example .env.local   # then fill in the env values
npm install
npm run dev                        # http://localhost:3000
```

You need to set up the environment variables in `.env.local` before the app will
work.

## What the user is reporting

**English:** On Safari (desktop) and iOS, the Browse page is janky — scrolling
the video grid stutters, and it gets progressively worse every time you open a
result and go back to the grid. On Chrome the same page is smooth. Find every
cause and fix them so the page is smooth on Safari/iOS, without regressing
anything (in particular, the grid must keep its scroll position when you return
from a detail view).

**中文：** 在 Safari（桌面端）和 iOS 上，Browse 页面很卡——滚动视频网格会卡顿，
而且每次打开一个结果再返回网格后，卡顿会越来越严重。但在 Chrome 上同样的页面是
流畅的。请找出所有原因并修复，让页面在 Safari/iOS 上也能流畅运行，同时不要引入
任何回归问题（尤其是从详情视图返回时，网格必须保持原来的滚动位置）。

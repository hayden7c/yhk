import type { DefaultTheme } from "vitepress";
import { sync } from "fast-glob";
import * as matter from "gray-matter";

export const sidebar: DefaultTheme.Config["sidebar"] = {
  "/views/ydc/": getItems("views/ydc"),
  "/views/yxy/": getItems("views/yxy"),
};
/* @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarItem[]}
 */
function getItems(path: string) {
  let topArticleItems: DefaultTheme.SidebarItem[] = [];

  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarItem[] = [];
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = [];
  let total = 0;
  // 当分组内文章数量少于 2 篇或文章总数显示超过 20 篇时，自动折叠分组
  const groupCollapsedSize = 2;
  const titleCollapsedSize = 20;

  // 1.获取所有分组目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let groupName = name;
    // 2.获取分组下的所有文章
    sync(`docs/${path}/${groupName}/*`, {
      onlyFiles: true,
      objectMode: true,
    }).forEach((article) => {
      const articleFile = matter.read(`${article.path}`);
      const { data } = articleFile;
      console.log(11111111);
      console.log(articleFile);
      if (data.isTop) {
        // 向置顶分组前追加标题
        topArticleItems.unshift({
          text: data.title,
          link: `/${path}/${groupName}/${article.name.replace(".md", "")}`,
        });
      }
      // 向前追加标题
      items.push({
        text: data.title,
        link: `/${path}/${groupName}/${article.name.replace(".md", "")}`,
      });
      total += 1;
    });
    // 3.向前追加到分组
    // 当分组内文章数量少于 A 篇或文章总数显示超过 B 篇时，自动折叠分组
    groups.push({
      text: `${groupName.substring(groupName.indexOf("-") + 1)} (${
        items.length
      }篇)`,
      items: items,
      collapsed:
        items.length < groupCollapsedSize || total > titleCollapsedSize,
    });
    // 4.清空侧边栏分组下标题数组
    items = [];
  });

  if (topArticleItems.length > 0) {
    // 添加置顶分组
    groups.unshift({
      text: `📑 我的置顶 (${topArticleItems.length}篇)`,
      items: topArticleItems,
      collapsed: false,
    });

    // 将最近年份分组展开
    groups[1].collapsed = false;
  } else {
    // 将最近年份分组展开
    groups[0].collapsed = false;
  }
  // 添加序号
  addOrderNumber(groups);
  return groups;
}
/**
 * 添加序号
 *
 * @param groups 分组数据
 */
function addOrderNumber(groups) {
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].items.length; j++) {
      const items = groups[i].items;
      items[j].text = `[${j + 1}] ${items[j].text}`;
    }
  }
}

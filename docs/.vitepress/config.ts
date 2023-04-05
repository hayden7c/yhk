import { defineConfig } from "vitepress";
import { metaData } from "./config/constants";
import { themeConfig } from "./config/theme";
import { head } from "./config/head";
import { markdown } from "./config/markdown";

export default defineConfig({
  lang: metaData.lang,
  title: metaData.title,
  description: metaData.description,
  cleanUrls: true,
  lastUpdated: true, // 显示最后更新时间
  head, // <head>内标签配置
  markdown: markdown, // Markdown配置
  themeConfig: themeConfig,
});

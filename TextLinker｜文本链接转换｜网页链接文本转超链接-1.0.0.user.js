// ==UserScript==
// @name         TextLinker｜文本链接转换｜网页链接文本转超链接
// @namespace    https://github.com/Airmomo
// @version      1.0.0
// @description  Convert text to links in web pages，这个脚本会在每个页面上运行，查找匹配链接格式的文本，并将其转换为超链接。
// @author       Airmomo
// @match        *://*/*
// @grant        none
// @license      GPLv3 License
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式，用于匹配链接格式的文本
    var linkRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;

    // 当页面加载完成后执行转换
    window.onload = function() {
        // 获取页面上的所有文本节点
        var textNodes = document.evaluate('//text()', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        // 遍历文本节点
        for (var i = 0; i < textNodes.snapshotLength; i++) {
            var node = textNodes.snapshotItem(i);
            var text = node.nodeValue;

            // 使用正则表达式查找匹配的链接文本
            var matches = text.match(linkRegex);

            // 如果找到匹配的链接文本
            if (matches) {
                // 创建一个文档片段，用于存储新的节点
                var fragment = document.createDocumentFragment();
                var lastIndex = 0;
                var nonLinkText; // 定义非链接文本变量

                // 遍历每个匹配项
                for (var j = 0; j < matches.length; j++) {
                    var link = matches[j];
                    var index = text.indexOf(link, lastIndex);

                    // 如果不是第一个匹配项，则将上一个非链接文本添加到文档片段中
                    if (index > lastIndex) {
                        nonLinkText = text.substring(lastIndex, index);
                        fragment.appendChild(document.createTextNode(nonLinkText));
                    }

                    // 创建链接元素
                    var a = document.createElement('a');
                    a.href = link;
                    a.textContent = link;
                    a.style.color = 'blue';
                    a.style.textDecoration = 'underline';
                    a.target = '_blank'; // 在新窗口打开链接
                    fragment.appendChild(a);

                    lastIndex = index + link.length;
                }

                // 将剩余的非链接文本添加到文档片段中
                if (lastIndex < text.length) {
                    nonLinkText = text.substring(lastIndex);
                    fragment.appendChild(document.createTextNode(nonLinkText));
                }

                // 替换原始文本节点为文档片段中的内容
                node.parentNode.replaceChild(fragment, node);
            }
        }
    };
})();
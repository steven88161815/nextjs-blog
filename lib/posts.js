import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

/*
process.cwd() 代表目前專案的根目錄。
path.join() 把它和 "posts" 合起來，變成 /你的專案/posts/ 的絕對路徑。
*/
const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
    // 拿取 /posts 資料夾中的所有檔案名稱
    // fileNames 會是一個陣列，比如：["hello-world.md", "my-first-post.md"]
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // 移除名稱中的 ".md"，並將它當作 id
        const id = fileName.replace(/\.md$/, "");

        // 將 markdown 內容轉換為字串
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // 使用 gray-matter 解析 metadata 區塊
        const matterResult = matter(fileContents);

        // 將資料與 id 結合
        return {
            id,
            ...matterResult.data,
        };
    });
    // 依照日期排序
    // 這樣新的文章（日期大的）會排在最前面！
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}

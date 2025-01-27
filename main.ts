import { serveDir } from "https://deno.land/std@0.175.0/http/file_server.ts";
import { renderFileToString, Params } from "https://deno.land/x/dejs@0.10.0/mod.ts";

const BASE_URL = "public"; // 静态资源根路径

const API_URL = "api"; // api请求路径

const UPLOAD_URL = "upload"; // 上传文件路径

const VIEWS_URL = "views"; // 视图路径

Deno.serve(async (req: Request) => {
  let pathname = new URL(req.url).pathname;

  // 接受处理上传文件
  if (pathname === "/" + UPLOAD_URL) {
    // 将文件保存到 UPLOAD_URL目录
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return await renderView("/404", {});
    }
    const filename = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const content = new Uint8Array(arrayBuffer);
    await Deno.writeFile(`./${UPLOAD_URL}/${filename}`, content);

    // 获取upload目录下文件列表
    return await renderView("/index", {
      title: "文件上传",
      files: await getFileList(),
    });
  }
  // api请求路径
  else if (pathname.startsWith(`/${API_URL}`)) {
    return new Response("404: Not Found", {
      status: 404,
    });
  }
  // 静态资源处理
  else if (pathname.startsWith(`/${BASE_URL}`)) {
    return serveDir(req, {
      fsRoot: `${BASE_URL}`,
      urlRoot: `${BASE_URL}`,
    });
  } else if (pathname.startsWith(`/${UPLOAD_URL}`)) {
    return serveDir(req, {
      fsRoot: `${UPLOAD_URL}`,
      urlRoot: `${UPLOAD_URL}`,
    });
  }

  // 视图处理
  let model = {};
  if (pathname === "/" || pathname === "/index") {
    model = {
      title: "文件上传",
      files: await getFileList(),
    };
    pathname = "/index";
  }
  return await renderView(pathname, model);
});

// 渲染视图
async function renderView(viewName: string, model: Params) {
  const viewPath = Deno.cwd() + `/${VIEWS_URL}${viewName}.ejs`;
  if (
    await Deno.stat(viewPath)
      .then(() => true)
      .catch(() => false)
  ) {
    const html = await renderFileToString(viewPath, model);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } else {
    const _404Path = Deno.cwd() + `/${VIEWS_URL}/404.ejs`;
    const html = await renderFileToString(_404Path, { title: "404" });
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}

// 获取upload目录下文件列表
async function getFileList() {
  const files = await Deno.readDir(`./${UPLOAD_URL}`);
  const fileList = [];
  for await (const file of files) {
    fileList.push(file.name);
  }
  return fileList;
}

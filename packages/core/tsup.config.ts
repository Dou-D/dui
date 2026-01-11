import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // 核心：告诉 tsup，react 和 @dui/hooks 不需要打包进去，
  // 使用者自己会安装这些依赖。
  external: ["react", "react-dom", "@dui/hooks"],
});

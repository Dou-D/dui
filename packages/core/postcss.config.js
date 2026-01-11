// apps/playground/postcss.config.js
export default {
  plugins: {
    // 👇 变动在这里：v4 必须用这个包
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

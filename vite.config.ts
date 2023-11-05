import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { prismjsPlugin } from "vite-plugin-prismjs";
import languages from "./src/languages"

export default defineConfig({
  plugins: [
    prismjsPlugin({
      languages: languages.list,
    }),
    solid(),
  ]  
})

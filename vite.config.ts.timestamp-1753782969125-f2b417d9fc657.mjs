// vite.config.ts
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "file:///C:/Aproject/eigent/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Aproject/eigent/node_modules/@vitejs/plugin-react/dist/index.mjs";
import electron from "file:///C:/Aproject/eigent/node_modules/vite-plugin-electron/dist/simple.mjs";

// package.json
var package_default = {
  name: "Eigent",
  version: "0.0.31",
  main: "dist-electron/main/index.js",
  description: "Eigent",
  author: "eigent",
  license: "MIT",
  private: true,
  debug: {
    env: {
      VITE_DEV_SERVER_URL: "http://127.0.0.1:7777/"
    }
  },
  type: "module",
  scripts: {
    "compile-babel": "cd backend && uv run pybabel compile -d lang",
    dev: "npm run compile-babel && vite",
    build: "npm run compile-babel && tsc && vite build &&  electron-builder -- --publish always",
    "build:mac": "npm run compile-babel && tsc && vite build && electron-builder --mac",
    "build:win": "npm run compile-babel && tsc && vite build && electron-builder --win",
    "build:all": "npm run compile-babel && tsc && vite build && electron-builder --mac --win",
    preview: "vite preview",
    pretest: "vite build --mode=test",
    test: "vitest run"
  },
  dependencies: {
    "@electron/notarize": "^2.5.0",
    "@fontsource/inter": "^5.2.5",
    "@microsoft/fetch-event-source": "^2.0.1",
    "@monaco-editor/loader": "^1.5.0",
    "@monaco-editor/react": "^4.7.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.13",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.11",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@stackframe/react": "file:package/@stackframe/react",
    "@xterm/addon-fit": "^0.10.0",
    "@xterm/addon-web-links": "^0.11.0",
    "@xterm/xterm": "^5.5.0",
    "@xyflow/react": "^12.6.4",
    "adm-zip": "^0.5.16",
    axios: "^1.9.0",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    cmdk: "^1.1.1",
    "csv-parser": "^3.2.0",
    "electron-log": "^5.4.0",
    "electron-updater": "^6.3.9",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.17.0",
    gsap: "^3.13.0",
    "lodash-es": "^4.17.21",
    "lottie-web": "^5.13.0",
    "lucide-react": "^0.509.0",
    mammoth: "^1.9.1",
    "monaco-editor": "^0.52.2",
    "next-themes": "^0.4.6",
    papaparse: "^5.5.3",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.6.0",
    "remark-gfm": "^4.0.1",
    sonner: "^2.0.6",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7",
    tar: "^7.4.3",
    "tree-kill": "^1.2.2",
    "tw-animate-css": "^1.2.9",
    unzipper: "^0.12.3",
    xml2js: "^0.6.2",
    zustand: "^5.0.4"
  },
  devDependencies: {
    "@playwright/test": "^1.48.2",
    "@types/lodash-es": "^4.17.12",
    "@types/papaparse": "^5.3.16",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/unzipper": "^0.10.11",
    "@types/xml2js": "^0.4.14",
    "@vitejs/plugin-react": "^4.3.3",
    autoprefixer: "^10.4.20",
    electron: "^33.2.0",
    "electron-builder": "^24.13.3",
    postcss: "^8.4.49",
    "postcss-import": "^16.1.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    tailwindcss: "^3.4.15",
    typescript: "^5.4.2",
    vite: "^5.4.11",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    vitest: "^2.1.5"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Aproject\\eigent";
var vite_config_default = defineConfig(({ command, mode }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  const env = loadEnv(mode, process.cwd(), "");
  return {
    resolve: {
      alias: {
        "@": path.join(__vite_injected_original_dirname, "src")
      }
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {}
      })
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(package_default.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port,
        proxy: {
          "/api": {
            target: env.VITE_PROXY_URL,
            changeOrigin: true
            // rewrite: path => path.replace(/^\/api/, ''),
          }
        }
      };
    })(),
    clearScreen: false
  };
});
process.on("SIGINT", () => {
  try {
    const backend = path.join(__vite_injected_original_dirname, "backend");
    const pid = readFileSync(backend + "/runtime/run.pid", "utf-8");
    process.kill(parseInt(pid), "SIGINT");
  } catch (e) {
    console.log("no pid file");
    console.log(e);
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQXByb2plY3RcXFxcZWlnZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxBcHJvamVjdFxcXFxlaWdlbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0Fwcm9qZWN0L2VpZ2VudC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJlYWRGaWxlU3luYywgcm1TeW5jIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24vc2ltcGxlJ1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbidcblxuXG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgcm1TeW5jKCdkaXN0LWVsZWN0cm9uJywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pXG5cbiAgY29uc3QgaXNTZXJ2ZSA9IGNvbW1hbmQgPT09ICdzZXJ2ZSdcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCdcbiAgY29uc3Qgc291cmNlbWFwID0gaXNTZXJ2ZSB8fCAhIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVR1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKVxuICByZXR1cm4ge1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycpXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIGVsZWN0cm9uKHtcbiAgICAgICAgbWFpbjoge1xuICAgICAgICAgIC8vIFNob3J0Y3V0IG9mIGBidWlsZC5saWIuZW50cnlgXG4gICAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluL2luZGV4LnRzJyxcbiAgICAgICAgICBvbnN0YXJ0KGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5WU0NPREVfREVCVUcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coLyogRm9yIGAudnNjb2RlLy5kZWJ1Zy5zY3JpcHQubWpzYCAqLydbc3RhcnR1cF0gRWxlY3Ryb24gQXBwJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFyZ3Muc3RhcnR1cCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aXRlOiB7XG4gICAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgICBzb3VyY2VtYXAsXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcbiAgICAgICAgICAgICAgb3V0RGlyOiAnZGlzdC1lbGVjdHJvbi9tYWluJyxcbiAgICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBwcmVsb2FkOiB7XG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxuICAgICAgICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXG4gICAgICAgICAgdml0ZToge1xuICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxuICAgICAgICAgICAgICBtaW5pZnk6IGlzQnVpbGQsXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vcHJlbG9hZCcsXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoJ2RlcGVuZGVuY2llcycgaW4gcGtnID8gcGtnLmRlcGVuZGVuY2llcyA6IHt9KSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cbiAgICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cbiAgICAgICAgLy8gU2VlIFx1RDgzRFx1REM0OSBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvbi1yZW5kZXJlclxuICAgICAgICByZW5kZXJlcjoge30sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHNlcnZlcjogcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHICYmICgoKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBrZy5kZWJ1Zy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhvc3Q6IHVybC5ob3N0bmFtZSxcbiAgICAgICAgcG9ydDogK3VybC5wb3J0LFxuICAgICAgICBwcm94eToge1xuICAgICAgICAgICcvYXBpJzoge1xuICAgICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9QUk9YWV9VUkwsXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAvLyByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0pKCksXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxuXG4gIH1cbn0pXG5cbnByb2Nlc3Mub24oJ1NJR0lOVCcsICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBiYWNrZW5kID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2JhY2tlbmQnKVxuICAgIGNvbnN0IHBpZCA9IHJlYWRGaWxlU3luYyhiYWNrZW5kICsgJy9ydW50aW1lL3J1bi5waWQnLCAndXRmLTgnKVxuICAgIHByb2Nlc3Mua2lsbChwYXJzZUludChwaWQpLCAnU0lHSU5UJylcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKCdubyBwaWQgZmlsZScpXG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufSlcbiIsICJ7XG5cdFwibmFtZVwiOiBcIkVpZ2VudFwiLFxuXHRcInZlcnNpb25cIjogXCIwLjAuMzFcIixcblx0XCJtYWluXCI6IFwiZGlzdC1lbGVjdHJvbi9tYWluL2luZGV4LmpzXCIsXG5cdFwiZGVzY3JpcHRpb25cIjogXCJFaWdlbnRcIixcblx0XCJhdXRob3JcIjogXCJlaWdlbnRcIixcblx0XCJsaWNlbnNlXCI6IFwiTUlUXCIsXG5cdFwicHJpdmF0ZVwiOiB0cnVlLFxuXHRcImRlYnVnXCI6IHtcblx0XHRcImVudlwiOiB7XG5cdFx0XHRcIlZJVEVfREVWX1NFUlZFUl9VUkxcIjogXCJodHRwOi8vMTI3LjAuMC4xOjc3NzcvXCJcblx0XHR9XG5cdH0sXG5cdFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwiY29tcGlsZS1iYWJlbFwiOiBcImNkIGJhY2tlbmQgJiYgdXYgcnVuIHB5YmFiZWwgY29tcGlsZSAtZCBsYW5nXCIsXG5cdFx0XCJkZXZcIjogXCJucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdml0ZVwiLFxuXHRcdFwiYnVpbGRcIjogXCJucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdHNjICYmIHZpdGUgYnVpbGQgJiYgIGVsZWN0cm9uLWJ1aWxkZXIgLS0gLS1wdWJsaXNoIGFsd2F5c1wiLFxuXHRcdFwiYnVpbGQ6bWFjXCI6IFwibnBtIHJ1biBjb21waWxlLWJhYmVsICYmIHRzYyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS1tYWNcIixcblx0XHRcImJ1aWxkOndpblwiOiBcIm5wbSBydW4gY29tcGlsZS1iYWJlbCAmJiB0c2MgJiYgdml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyIC0td2luXCIsXG5cdFx0XCJidWlsZDphbGxcIjogXCJucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdHNjICYmIHZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLW1hYyAtLXdpblwiLFxuXHRcdFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuXHRcdFwicHJldGVzdFwiOiBcInZpdGUgYnVpbGQgLS1tb2RlPXRlc3RcIixcblx0XHRcInRlc3RcIjogXCJ2aXRlc3QgcnVuXCJcblx0fSxcblx0XCJkZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiQGVsZWN0cm9uL25vdGFyaXplXCI6IFwiXjIuNS4wXCIsXG5cdFx0XCJAZm9udHNvdXJjZS9pbnRlclwiOiBcIl41LjIuNVwiLFxuXHRcdFwiQG1pY3Jvc29mdC9mZXRjaC1ldmVudC1zb3VyY2VcIjogXCJeMi4wLjFcIixcblx0XHRcIkBtb25hY28tZWRpdG9yL2xvYWRlclwiOiBcIl4xLjUuMFwiLFxuXHRcdFwiQG1vbmFjby1lZGl0b3IvcmVhY3RcIjogXCJeNC43LjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1hY2NvcmRpb25cIjogXCJeMS4yLjExXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtZGlhbG9nXCI6IFwiXjEuMS4xNFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnVcIjogXCJeMi4xLjE1XCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtbGFiZWxcIjogXCJeMi4xLjdcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1wb3BvdmVyXCI6IFwiXjEuMS4xM1wiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXByb2dyZXNzXCI6IFwiXjEuMS43XCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0XCI6IFwiXjIuMi41XCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3Qtc2VwYXJhdG9yXCI6IFwiXjEuMS43XCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiOiBcIl4xLjIuM1wiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXN3aXRjaFwiOiBcIl4xLjIuNFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXRhYnNcIjogXCJeMS4xLjExXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtdG9nZ2xlXCI6IFwiXjEuMS45XCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtdG9nZ2xlLWdyb3VwXCI6IFwiXjEuMS4xMFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIjogXCJeMS4yLjdcIixcblx0XHRcIkBzdGFja2ZyYW1lL3JlYWN0XCI6IFwiZmlsZTpwYWNrYWdlL0BzdGFja2ZyYW1lL3JlYWN0XCIsXG5cdFx0XCJAeHRlcm0vYWRkb24tZml0XCI6IFwiXjAuMTAuMFwiLFxuXHRcdFwiQHh0ZXJtL2FkZG9uLXdlYi1saW5rc1wiOiBcIl4wLjExLjBcIixcblx0XHRcIkB4dGVybS94dGVybVwiOiBcIl41LjUuMFwiLFxuXHRcdFwiQHh5Zmxvdy9yZWFjdFwiOiBcIl4xMi42LjRcIixcblx0XHRcImFkbS16aXBcIjogXCJeMC41LjE2XCIsXG5cdFx0XCJheGlvc1wiOiBcIl4xLjkuMFwiLFxuXHRcdFwiY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5XCI6IFwiXjAuNy4xXCIsXG5cdFx0XCJjbHN4XCI6IFwiXjIuMS4xXCIsXG5cdFx0XCJjbWRrXCI6IFwiXjEuMS4xXCIsXG5cdFx0XCJjc3YtcGFyc2VyXCI6IFwiXjMuMi4wXCIsXG5cdFx0XCJlbGVjdHJvbi1sb2dcIjogXCJeNS40LjBcIixcblx0XHRcImVsZWN0cm9uLXVwZGF0ZXJcIjogXCJeNi4zLjlcIixcblx0XHRcImVtYmxhLWNhcm91c2VsLWF1dG9wbGF5XCI6IFwiXjguNi4wXCIsXG5cdFx0XCJlbWJsYS1jYXJvdXNlbC1yZWFjdFwiOiBcIl44LjYuMFwiLFxuXHRcdFwiZnJhbWVyLW1vdGlvblwiOiBcIl4xMi4xNy4wXCIsXG5cdFx0XCJnc2FwXCI6IFwiXjMuMTMuMFwiLFxuXHRcdFwibG9kYXNoLWVzXCI6IFwiXjQuMTcuMjFcIixcblx0XHRcImxvdHRpZS13ZWJcIjogXCJeNS4xMy4wXCIsXG5cdFx0XCJsdWNpZGUtcmVhY3RcIjogXCJeMC41MDkuMFwiLFxuXHRcdFwibWFtbW90aFwiOiBcIl4xLjkuMVwiLFxuXHRcdFwibW9uYWNvLWVkaXRvclwiOiBcIl4wLjUyLjJcIixcblx0XHRcIm5leHQtdGhlbWVzXCI6IFwiXjAuNC42XCIsXG5cdFx0XCJwYXBhcGFyc2VcIjogXCJeNS41LjNcIixcblx0XHRcInJlYWN0LW1hcmtkb3duXCI6IFwiXjEwLjEuMFwiLFxuXHRcdFwicmVhY3Qtcm91dGVyLWRvbVwiOiBcIl43LjYuMFwiLFxuXHRcdFwicmVtYXJrLWdmbVwiOiBcIl40LjAuMVwiLFxuXHRcdFwic29ubmVyXCI6IFwiXjIuMC42XCIsXG5cdFx0XCJ0YWlsd2luZC1tZXJnZVwiOiBcIl4zLjMuMFwiLFxuXHRcdFwidGFpbHdpbmRjc3MtYW5pbWF0ZVwiOiBcIl4xLjAuN1wiLFxuXHRcdFwidGFyXCI6IFwiXjcuNC4zXCIsXG5cdFx0XCJ0cmVlLWtpbGxcIjogXCJeMS4yLjJcIixcblx0XHRcInR3LWFuaW1hdGUtY3NzXCI6IFwiXjEuMi45XCIsXG5cdFx0XCJ1bnppcHBlclwiOiBcIl4wLjEyLjNcIixcblx0XHRcInhtbDJqc1wiOiBcIl4wLjYuMlwiLFxuXHRcdFwienVzdGFuZFwiOiBcIl41LjAuNFwiXG5cdH0sXG5cdFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCJeMS40OC4yXCIsXG5cdFx0XCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuMTJcIixcblx0XHRcIkB0eXBlcy9wYXBhcGFyc2VcIjogXCJeNS4zLjE2XCIsXG5cdFx0XCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMy4xMlwiLFxuXHRcdFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcblx0XHRcIkB0eXBlcy91bnppcHBlclwiOiBcIl4wLjEwLjExXCIsXG5cdFx0XCJAdHlwZXMveG1sMmpzXCI6IFwiXjAuNC4xNFwiLFxuXHRcdFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjNcIixcblx0XHRcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjIwXCIsXG5cdFx0XCJlbGVjdHJvblwiOiBcIl4zMy4yLjBcIixcblx0XHRcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCJeMjQuMTMuM1wiLFxuXHRcdFwicG9zdGNzc1wiOiBcIl44LjQuNDlcIixcblx0XHRcInBvc3Rjc3MtaW1wb3J0XCI6IFwiXjE2LjEuMFwiLFxuXHRcdFwicmVhY3RcIjogXCJeMTguMy4xXCIsXG5cdFx0XCJyZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXG5cdFx0XCJ0YWlsd2luZGNzc1wiOiBcIl4zLjQuMTVcIixcblx0XHRcInR5cGVzY3JpcHRcIjogXCJeNS40LjJcIixcblx0XHRcInZpdGVcIjogXCJeNS40LjExXCIsXG5cdFx0XCJ2aXRlLXBsdWdpbi1lbGVjdHJvblwiOiBcIl4wLjI5LjBcIixcblx0XHRcInZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXCI6IFwiXjAuMTQuNlwiLFxuXHRcdFwidml0ZXN0XCI6IFwiXjIuMS41XCJcblx0fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TyxTQUFTLGNBQWMsY0FBYztBQUNuUixPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYzs7O0FDSnJCO0FBQUEsRUFDQyxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxPQUFTO0FBQUEsSUFDUixLQUFPO0FBQUEsTUFDTixxQkFBdUI7QUFBQSxJQUN4QjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNWLGlCQUFpQjtBQUFBLElBQ2pCLEtBQU87QUFBQSxJQUNQLE9BQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLFNBQVc7QUFBQSxJQUNYLFNBQVc7QUFBQSxJQUNYLE1BQVE7QUFBQSxFQUNUO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2Ysc0JBQXNCO0FBQUEsSUFDdEIscUJBQXFCO0FBQUEsSUFDckIsaUNBQWlDO0FBQUEsSUFDakMseUJBQXlCO0FBQUEsSUFDekIsd0JBQXdCO0FBQUEsSUFDeEIsNkJBQTZCO0FBQUEsSUFDN0IsMEJBQTBCO0FBQUEsSUFDMUIsaUNBQWlDO0FBQUEsSUFDakMseUJBQXlCO0FBQUEsSUFDekIsMkJBQTJCO0FBQUEsSUFDM0IsNEJBQTRCO0FB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

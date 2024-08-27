import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  //transforma o COMMUN em ES
  const tsConfigPaths = await import("vite-tsconfig-paths").then(
    (mod) => mod.default
  );
  return {
    test: {
      include: ["**/*.e2e-spec.ts"],
      globals: true,
      root: "./",
      setupFiles: ["./test/setup-e2e.ts"],
    },
    plugins: [
      swc.vite({
        module: { type: "es6" },
      }),

      tsConfigPaths(),
    ],
  };
});

export default {
    base: "/Pump/",
    root: ".", 
    publicDir: "public", 
    build: {
      outDir: "dist"
    },
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        "@": "/src"
      }
    }
  };
  
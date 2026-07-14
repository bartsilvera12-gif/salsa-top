// Asegura que archivos que Next podría no copiar (dotfiles) queden en out/.
// Se ejecuta automáticamente después de `next build` (script "postbuild").
import { existsSync, copyFileSync } from "node:fs";

if (existsSync("out")) {
  if (existsSync("public/.htaccess")) {
    copyFileSync("public/.htaccess", "out/.htaccess");
    console.log("postbuild: .htaccess copiado a out/");
  }
} else {
  console.log("postbuild: no hay carpeta out/ (¿output:'export'?), se omite");
}

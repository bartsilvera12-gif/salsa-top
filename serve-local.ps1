# Servidor local para ver el sitio Salsa Top en tu navegador.
# Sirve la carpeta donde esta este archivo. No requiere instalar nada.
$root = $PSScriptRoot
$ports = @(8080, 8090, 3000, 5500)
$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".gif"="image/gif";
  ".webp"="image/webp"; ".svg"="image/svg+xml"; ".ico"="image/x-icon";
  ".css"="text/css"; ".js"="application/javascript"; ".json"="application/json";
  ".woff2"="font/woff2"; ".woff"="font/woff"; ".ttf"="font/ttf"; ".mp4"="video/mp4"
}

$listener = New-Object System.Net.HttpListener
$bound = $false
foreach ($p in $ports) {
  try {
    $listener.Prefixes.Clear()
    $listener.Prefixes.Add("http://localhost:$p/")
    $listener.Start()
    $port = $p; $bound = $true; break
  } catch { }
}
if (-not $bound) { Write-Host "No se pudo abrir un puerto local. Cerra otros programas y reintenta."; Read-Host "Enter para salir"; exit }

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  ==============================================" -ForegroundColor Yellow
Write-Host "   SALSA TOP - sitio corriendo en tu PC" -ForegroundColor Yellow
Write-Host "   $url" -ForegroundColor Green
Write-Host "  ==============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Deja esta ventana ABIERTA mientras uses el sitio."
Write-Host "  Para cerrar el sitio: cerra esta ventana."
Write-Host ""
Start-Process $url

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  } catch { }
}

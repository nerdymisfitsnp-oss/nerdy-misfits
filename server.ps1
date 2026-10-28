$port = 8787
$root = "c:\Users\josep\OneDrive\Desktop\NerdyMisfits"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".mp3"  = "audio/mpeg"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Nerdy Misfits Redesign Server running at http://localhost:$port/"

while ($listener.IsListening) {
  $context = $null
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/" -or [string]::IsNullOrEmpty($localPath)) {
      $localPath = "/index.html"
    }

    $safeRelPath = $localPath.TrimStart('/').Replace('/', '\')
    $filePath = Join-Path $root $safeRelPath

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = $mimeTypes[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $contentType
      $response.ContentLength64 = $bytes.Length
      $response.StatusCode = 200
      $response.Headers.Add("Cache-Control", "no-cache")
      if ($request.HttpMethod -ne "HEAD") {
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
      $response.ContentLength64 = $msg.Length
      if ($request.HttpMethod -ne "HEAD") {
        $response.OutputStream.Write($msg, 0, $msg.Length)
      }
    }
  } catch {
    Write-Output "Request error: $_"
  } finally {
    if ($context -and $context.Response) {
      try { $context.Response.OutputStream.Close() } catch {}
    }
  }
}

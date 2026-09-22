$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "HTTP server listening on $prefix"

$baseDir = "d:\shamil anti"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".woff2" = "font/woff2"
    ".woff" = "font/woff"
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $rawUrl = $request.RawUrl.Split('?')[0]
            $decodedUrl = [System.Uri]::UnescapeDataString($rawUrl)
            if ($decodedUrl -eq "/" -or [string]::IsNullOrWhiteSpace($decodedUrl)) {
                $decodedUrl = "/index.html"
            }

            $relPath = $decodedUrl.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::Combine($baseDir, $relPath)

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Accept-Ranges", "bytes")

                $fileInfo = New-Object System.IO.FileInfo($filePath)
                $fileLength = $fileInfo.Length

                $rangeHeader = $request.Headers["Range"]
                if ($null -ne $rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                    $rangeSpec = $rangeHeader.Substring(6).Split('-')
                    [long]$start = 0
                    [long]$end = $fileLength - 1

                    if (-not [string]::IsNullOrWhiteSpace($rangeSpec[0])) {
                        $start = [long]::Parse($rangeSpec[0])
                    }
                    if ($rangeSpec.Length -gt 1 -and -not [string]::IsNullOrWhiteSpace($rangeSpec[1])) {
                        $end = [long]::Parse($rangeSpec[1])
                    }
                    if ($end -ge $fileLength) {
                        $end = $fileLength - 1
                    }

                    $length = $end - $start + 1
                    $response.StatusCode = 206
                    $response.StatusDescription = "Partial Content"
                    $response.Headers.Add("Content-Range", "bytes $start-$end/$fileLength")
                    $response.ContentLength64 = $length

                    if ($request.HttpMethod -ne "HEAD") {
                        $fs = [System.IO.File]::OpenRead($filePath)
                        try {
                            $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                            $buffer = New-Object byte[] (64 * 1024)
                            [long]$bytesRemaining = $length
                            while ($bytesRemaining -gt 0) {
                                $bytesToRead = [Math]::Min([long]$buffer.Length, $bytesRemaining)
                                $bytesRead = $fs.Read($buffer, 0, [int]$bytesToRead)
                                if ($bytesRead -le 0) { break }
                                $response.OutputStream.Write($buffer, 0, $bytesRead)
                                $bytesRemaining -= $bytesRead
                            }
                        } finally {
                            $fs.Close()
                        }
                    }
                } else {
                    $response.StatusCode = 200
                    $response.ContentLength64 = $fileLength
                    if ($request.HttpMethod -ne "HEAD") {
                        $fs = [System.IO.File]::OpenRead($filePath)
                        try {
                            $buffer = New-Object byte[] (64 * 1024)
                            while ($true) {
                                $bytesRead = $fs.Read($buffer, 0, $buffer.Length)
                                if ($bytesRead -le 0) { break }
                                $response.OutputStream.Write($buffer, 0, $bytesRead)
                            }
                        } finally {
                            $fs.Close()
                        }
                    }
                }
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawUrl")
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            $response.OutputStream.Close()
        } catch {
            Write-Output "Request handling warning: $_"
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

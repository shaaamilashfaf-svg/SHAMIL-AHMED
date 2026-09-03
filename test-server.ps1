$urls = @(
    'http://localhost:8080/styles/main.css',
    'http://localhost:8080/styles/components.css',
    'http://localhost:8080/styles/animations.css',
    'http://localhost:8080/scripts/main.js',
    'http://localhost:8080/scripts/case-studies.js',
    'http://localhost:8080/scripts/clock.js',
    'http://localhost:8080/assets/images/haus.jpg',
    'http://localhost:8080/assets/images/gandaura.jpg',
    'http://localhost:8080/assets/images/rentbiz.jpg',
    'http://localhost:8080/assets/images/noviindus.jpg',
    'http://localhost:8080/assets/images/philosophy.jpg'
)

foreach ($url in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Output "[$($res.StatusCode)] $url ($($res.Headers['Content-Type']))"
    } catch {
        Write-Output "[FAIL] $url : $_"
    }
}

$urls = @(
    'http://localhost:8080/',
    'http://localhost:8080/index.html',
    'http://localhost:8080/styles/main.css',
    'http://localhost:8080/scripts/main.js',
    'http://localhost:8080/assets/images/hero_bg.jpg',
    'http://localhost:8080/assets/images/kuthampully.jpg',
    'http://localhost:8080/assets/images/paddle_kayak.jpg',
    'http://localhost:8080/assets/images/jaihind_tv.jpg',
    'http://localhost:8080/assets/images/shamil_portrait.jpg',
    'http://localhost:8080/assets/images/food_commercial.jpg',
    'http://localhost:8080/assets/images/bts_rig.jpg',
    'http://localhost:8080/assets/images/bts_directing.jpg',
    'http://localhost:8080/assets/images/bts_lighting.jpg',
    'http://localhost:8080/assets/images/editing_suite.jpg'
)

foreach ($url in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Output "[$($res.StatusCode)] $url ($($res.Headers['Content-Type']))"
    } catch {
        Write-Output "[FAIL] $url : $_"
    }
}

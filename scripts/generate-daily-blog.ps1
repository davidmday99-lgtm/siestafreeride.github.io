# Generate and publish a daily blog post
$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $siteRoot

$date = Get-Date -Format "MMMM d, yyyy"
$dateSlug = Get-Date -Format "yyyy-MM-dd"
$title = "Daily Update - $date"
$filename = "blog/$dateSlug-daily-blog.html"

# Avoid overwriting existing posts
if (Test-Path $filename) {
    Write-Host "Post for $date already exists at $filename. Exiting."
    exit 0
}

# Read existing first post's link to use as "Next up"
$nextUpHref = "/blog/easter-spring-events-siesta-key-2026.html"
$nextUpText = "Easter & Spring Events in Siesta Key 2026"
if (Test-Path "blog/easter-spring-events-siesta-key-2026.html") {
    # nothing
} elseif (Test-Path "blog/top-5-things-to-do-siesta-key.html") {
    $nextUpHref = "/blog/top-5-things-to-do-siesta-key.html"
    $nextUpText = "Top 5 Things to Do in Siesta Key This Weekend"
} else {
    $nextUpHref = "/blog.html"
    $nextUpText = "More Blog Posts"
}

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>$title | Siesta Free Ride</title>
    <meta name="description" content="Daily update from Siesta Free Ride – your trusted transportation in Siesta Key, FL."/>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: '#8FAABC',
                        accent: '#C9D4DC',
                        background: '#F5F0E8',
                        surface: '#E8E4DC',
                        primary: '#8FAABC',
                        secondary: '#C9D4DC'
                    }
                }
            }
        }
    </script>
    <style>
        .cursive-text {
            font-family: cursive, "Brush Script MT", "Lucida Handwriting", serif;
            font-style: italic;
            color: #8FAABC;
        }
        @media (max-width: 768px) {
            .cursive-text { font-size: 2rem; }
        }
    </style>
</head>
<body class="bg-background">
    <header class="sticky top-0 z-50 bg-surface shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="/assets/logo.png" alt="Siesta Free Ride" class="h-24">
                <span class="cursive-text text-3xl font-bold text-brand" style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">Siesta Free Ride</span>
            </div>
            <nav class="hidden md:flex gap-6">
                <a href="/" class="hover:text-brand">Home</a>
                <a href="/blog.html" class="text-brand font-medium">Blog</a>
                <a href="/contact.html" class="bg-brand text-white px-4 py-1.5 rounded-md">Book Now</a>
            </nav>
            <button class="md:hidden text-2xl" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">&#9776;</button>
        </div>
        <div id="mobile-menu" class="md:hidden hidden border-t bg-surface">
            <div class="px-4 py-3 space-y-3">
                <a href="/" class="block hover:text-brand">Home</a>
                <a href="/blog.html" class="block text-brand font-medium">Blog</a>
                <a href="/contact.html" class="block">Book Now</a>
            </div>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-12">
        <article>
            <div class="mb-8"><a href="/blog.html" class="text-brand font-medium">&larr; Back to Blog</a></div>
            <header class="mb-10">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">$title</h1>
                <div class="flex items-center gap-4 text-gray-500">
                    <span>$date</span><span>&bull;</span><span>3 min read</span>
                </div>
            </header>
            <div class="prose prose-lg max-w-none">
                <p class="lead text-xl text-gray-700 mb-8">Here's your daily update from Siesta Free Ride. We're committed to keeping you informed about transportation tips, local events, and what's happening around Siesta Key.</p>
                <h2 class="text-2xl font-bold mt-10 mb-4">Today's Highlight</h2>
                <p>(This post was auto-generated. Content will be customized soon.)</p>
                <div class="bg-gray-100 p-6 rounded-lg mt-12">
                    <h3 class="text-xl font-bold mb-3">Need a Ride?</h3>
                    <p>Whether you're heading to the airport, exploring the island, or need a reliable driver, <strong>Siesta Free Ride</strong> has you covered.</p>
                    <p class="mt-3"><a href="/contact.html" class="bg-brand text-white px-6 py-3 rounded-md font-medium inline-block">Book Your Ride Today &rarr;</a></p>
                    <p class="mt-3 text-lg font-medium">Or call/text: <a href="tel:9416008380" class="text-brand">941‑600‑8380</a></p>
                </div>
                <div class="mt-12 pt-8 border-t">
                    <p class="text-gray-600"><strong>Next up:</strong> <a href="$nextUpHref" class="text-brand font-medium">$nextUpText</a></p>
                </div>
            </div>
        </article>
    </main>

    <footer class="bg-gray-900 text-gray-200 py-8 mt-12">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; <span id="yr"></span> Siesta Free Ride. <a href="/" class="text-accent">Home</a></p>
        </div>
    </footer>

    <script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>
"@

$html | Out-File -FilePath $filename -Encoding UTF8
Write-Host "Created: $filename"

# Update blog index
$href = "/blog/$dateSlug-daily-blog.html"
$description = "Here's your daily update from Siesta Free Ride. We're committed to keeping you informed about transportation tips, local events, and what's happening around Siesta Key."
& "scripts\update-blog-index.ps1" -Title $title -Date $date -Description $description -Href $href

# Add, commit, push
git add $filename blog.html
git commit -m "Add daily blog post: $date"
git push origin main
Write-Host "Pushed to GitHub."
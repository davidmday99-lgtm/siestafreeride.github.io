# Update blog index with a new post entry
param(
    [string]$Title,
    [string]$Date,
    [string]$Description,
    [string]$Href
)

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$blogIndex = Join-Path $siteRoot "blog.html"

if (-not (Test-Path $blogIndex)) {
    Write-Error "blog.html not found at $blogIndex"
    exit 1
}

# Read the file content
$lines = Get-Content $blogIndex

# Find the line index of '<div class="grid gap-8">'
$gridLineIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '<div class="grid gap-8">') {
        $gridLineIndex = $i
        break
    }
}

if ($gridLineIndex -eq -1) {
    Write-Error "Could not find grid div in blog.html"
    exit 1
}

# Create the new article block (indentation matches surrounding code)
$newArticle = @"
            <article class="border-b pb-8">
                <h2 class="text-2xl font-bold mb-2">
                    <a href="$Href" class="hover:text-brand">$Title</a>
                </h2>
                <p class="text-gray-500 mb-3">$Date</p>
                <p class="mb-4">$Description</p>
                <a href="$Href" class="text-brand font-medium">Read more &rarr;</a>
            </article>
"@

# Check if this href already exists in the blog index
if ($lines -match [regex]::Escape($Href)) {
    Write-Host "Blog index already contains an entry for $Href; skipping duplicate."
    exit 0
}

# Insert the new article after the grid line
$lines = @(
    $lines[0..$gridLineIndex]
    $newArticle
    $lines[($gridLineIndex+1)..($lines.Count-1)]
)

# Write back to file
[System.IO.File]::WriteAllText($blogIndex, ($lines -join "`r`n"), [System.Text.Encoding]::UTF8)

Write-Host "Updated blog index with new post: $Title"
Write-Host "File: $blogIndex"
# Update blog.html JavaScript posts array with a new post entry
# Created by: openclaw | Purpose: Auto-sync blog index | Fed by: generate-daily-blog.ps1/cron | Feeds: blog.html

param(
    [Parameter(Mandatory=$true)][string]$Title,
    [Parameter(Mandatory=$true)][string]$DateSlug,  # YYYY-MM-DD format
    [Parameter(Mandatory=$true)][string]$Excerpt
)

$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$blogIndex = Join-Path $siteRoot "blog.html"

if (-not (Test-Path $blogIndex)) {
    Write-Error "blog.html not found at $blogIndex"
    exit 1
}

# Read the file content
$content = Get-Content $blogIndex -Raw

# Check if this date already exists in the posts array
if ($content -match "date: '$DateSlug'") {
    Write-Host "Blog index already contains an entry for $DateSlug; skipping duplicate."
    exit 0
}

# Escape single quotes in title and excerpt for JavaScript
$escapedTitle = $Title -replace "'", "\'"
$escapedExcerpt = $Excerpt -replace "'", "\'"

# Create the new post entry
$slug = "$DateSlug-daily-blog"
$newEntry = "            { date: '$DateSlug', title: '$escapedTitle', slug: '$slug', excerpt: '$escapedExcerpt' },"

# Find "var posts = [" and insert the new entry right after it
$pattern = "(var posts = \[\s*\r?\n)"
if ($content -match $pattern) {
    $content = $content -replace $pattern, "`$1$newEntry`n"
    
    # Write back to file
    [System.IO.File]::WriteAllText($blogIndex, $content, [System.Text.Encoding]::UTF8)
    
    Write-Host "Updated blog index with new post: $Title ($DateSlug)"
    Write-Host "File: $blogIndex"
} else {
    Write-Error "Could not find 'var posts = [' in blog.html"
    exit 1
}

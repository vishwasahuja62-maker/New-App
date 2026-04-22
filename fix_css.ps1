
$path = "D:\MYNEWAPP\frontend\src\dashboard.css"
$content = [System.IO.File]::ReadAllText($path)
$idx = $content.LastIndexOf("backdrop-filter: blur(12px);")
if ($idx -ge 0) {
    $closingBraceIdx = $content.IndexOf("}", $idx)
    if ($closingBraceIdx -ge 0) {
        $truncated = $content.Substring(0, $closingBraceIdx + 1)
        $extra = @"

/* Integrated Features Layout */
.view-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--glass-border);
}

.view-title {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 0.25rem;
}

.metric-value {
    font-size: 3rem;
    font-weight: 900;
    color: var(--primary-color);
    letter-spacing: -0.05em;
}

.btn-text {
    font-weight: 700;
    transition: all 0.3s;
}

.btn-text:hover {
    transform: translateX(5px);
    opacity: 0.8;
}

.learning-card.expanded {
    grid-column: span 12;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
}
"@
        [System.IO.File]::WriteAllText($path, $truncated + $extra, [System.Text.Encoding]::UTF8)
        Write-Output "File fixed successfully"
    } else {
        Write-Output "Closing brace not found"
    }
} else {
    Write-Output "Marker not found"
}

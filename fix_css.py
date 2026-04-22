
import os

filepath = r'd:\MYNEWAPP\frontend\src\dashboard.css'
with open(filepath, 'rb') as f:
    content = f.read()

# Find the last occurrence of the closing brace for the modal-overlay
# which we know is the last "good" part.
marker = b'backdrop-filter: blur(12px);\r\n}'
if marker not in content:
    marker = b'backdrop-filter: blur(12px);\n}'

if marker in content:
    idx = content.rindex(marker) + len(marker)
    clean_content = content[:idx]
    
    extra_css = b"""
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
"""
    with open(filepath, 'wb') as f:
        f.write(clean_content)
        f.write(extra_css)
    print("Fixed dashboard.css")
else:
    print("Marker not found")

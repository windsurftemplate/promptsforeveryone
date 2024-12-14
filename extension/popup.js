// Store the scraped HTML
let currentHTML = null;

// Function to format HTML with proper indentation
function formatHTML(html) {
    if (!html) return '';
    
    let formatted = '';
    let indent = 0;
    const lines = html.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;
        
        // Decrease indent for closing tags
        if (trimmedLine.startsWith('</')) {
            indent = Math.max(0, indent - 1);
        }
        
        // Add indentation
        formatted += '  '.repeat(indent) + trimmedLine + '\n';
        
        // Increase indent for opening tags, but not for self-closing or specific inline tags
        if (trimmedLine.startsWith('<') && 
            !trimmedLine.endsWith('/>') && 
            !trimmedLine.endsWith('</') &&
            !/^<(br|hr|img|input|link|meta)\b/i.test(trimmedLine)) {
            indent++;
        }
    });
    
    return formatted;
}

// Function that will be injected into the page
async function scrapePageContent() {
    function getElementStyles(element) {
        const styles = window.getComputedStyle(element);
        const importantStyles = {};
        
        const styleProps = [
            'display', 'position', 'width', 'height', 'margin', 'padding',
            'background-color', 'color', 'font-family', 'font-size',
            'border', 'border-radius', 'box-shadow', 'flex', 'grid',
            'transform', 'opacity', 'z-index', 'text-align'
        ];
        
        styleProps.forEach(prop => {
            const value = styles.getPropertyValue(prop);
            if (value && value !== 'none' && value !== 'normal' && value !== '0px') {
                importantStyles[prop] = value;
            }
        });
        
        return importantStyles;
    }

    function getHTMLWithStyles(node = document.documentElement, isRoot = true) {
        if (!node || (node.tagName === 'SCRIPT' && node.style?.display === 'none')) {
            return '';
        }
        
        let html = '';
        
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) {
                html += text;
            }
            return html;
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const styles = getElementStyles(node);
            
            html += '<' + tag;
            
            if (node.id) {
                html += ` id="${node.id}"`;
            }
            
            if (node.className) {
                html += ` class="${node.className}"`;
            }
            
            if (Object.keys(styles).length > 0) {
                const styleStr = Object.entries(styles)
                    .map(([prop, value]) => `${prop}: ${value}`)
                    .join('; ');
                html += ` style="${styleStr}"`;
            }
            
            html += '>';
            
            if (node.children.length > 0) {
                html += '\n';
            }
            
            Array.from(node.childNodes).forEach(child => {
                const childHtml = getHTMLWithStyles(child, false);
                if (childHtml) {
                    html += '  ' + childHtml.split('\n').join('\n  ') + '\n';
                }
            });
            
            html += '</' + tag + '>';
            
            if (isRoot) {
                const doctype = '<!DOCTYPE html>\n';
                const head = document.head.outerHTML;
                html = doctype + '<html>\n' + head + '\n' + html + '\n</html>';
            }
        }
        
        return html;
    }

    try {
        return getHTMLWithStyles();
    } catch (error) {
        console.error('Scraping error:', error);
        return null;
    }
}

// Initialize scrape button
document.getElementById('scrapeButton').addEventListener('click', async () => {
    const loading = document.getElementById('loading');
    const codeWindow = document.getElementById('codeWindow');
    
    loading.style.display = 'block';
    codeWindow.style.display = 'none';
    
    try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Execute the scraping function in the page context
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapePageContent,
            world: 'MAIN'  // This ensures we run in the main world with access to the page
        });
        
        const result = results[0]?.result;
        
        if (result) {
            currentHTML = result;
            
            // Format and display the HTML
            const formattedHTML = formatHTML(currentHTML);
            document.getElementById('htmlSection').textContent = formattedHTML;
            
            loading.style.display = 'none';
            codeWindow.style.display = 'block';
            document.getElementById('copyButton').style.display = 'block';
            document.getElementById('downloadButton').style.display = 'block';
        } else {
            throw new Error('Failed to scrape page content');
        }
    } catch (error) {
        console.error('Extension error:', error);
        loading.innerHTML = `
            <div class="error">
                Error: ${error.message || 'Failed to scrape page'}
            </div>
        `;
    }
});

// Copy button handler
document.getElementById('copyButton').addEventListener('click', () => {
    if (!currentHTML) return;
    
    navigator.clipboard.writeText(currentHTML).then(() => {
        const button = document.getElementById('copyButton');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 1500);
    });
});

// Download button handler
document.getElementById('downloadButton').addEventListener('click', () => {
    if (!currentHTML) return;
    
    const blob = new Blob([currentHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${new Date().toISOString()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Screenshot button handler
document.getElementById('screenshotButton').addEventListener('click', async () => {
    const button = document.getElementById('screenshotButton');
    const originalText = button.textContent;
    button.textContent = 'Capturing...';
    button.disabled = true;

    try {
        // Capture the visible tab
        const dataUrl = await chrome.tabs.captureVisibleTab(null, {
            format: 'png',
            quality: 100
        });

        if (dataUrl) {
            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Create download URL and trigger download
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `screenshot-${timestamp}.png`;

            await chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            });

            URL.revokeObjectURL(url);
            button.textContent = 'Done!';
        } else {
            throw new Error('Failed to capture screenshot');
        }
    } catch (error) {
        console.error('Screenshot error:', error);
        button.textContent = 'Failed!';
    }

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});

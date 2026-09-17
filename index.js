/**
 * HTML Mod Block Engine
 * Features:
 *  - Parses strict header metadata configurations
 *  - Strips comment blocks wrapped in <! COMMENT >
 *  - Extracts and injects HTML block elements ending in '-m'
 */

class HTMLModEngine {
    constructor() {
        this.config = {};
        this.htmlBlocks = new Map();
    }

    /**
     * Parses the strict single-line configuration header
     * @param {string} headerStr 
     */
    parseHeader(headerStr) {
        if (!headerStr) return;

        // Match key-value configuration flags like #numbers=false.
        const kvRegex = /#([a-zA-Z0-9]+)=([^.]+)\./g;
        let match;
        
        while ((match = kvRegex.exec(headerStr)) !== null) {
            const key = match[1];
            let val = match[2].trim();
            
            if (val === 'false') val = false;
            else if (val === 'true') val = true;
            
            this.config[key] = val;
        }
    }

    /**
     * Strips out comment blocks wrapped in <!COMMENT_TEXT>
     * @param {string} rawContent 
     * @returns {string} Content free of custom comments
     */
    stripHtmlComments(rawContent) {
        return rawContent.replace(/<![\s\S]*?>/g, '');
    }

    /**
     * Parses the raw code text to extract individual HTML structural blocks ending in -m
     * @param {string} cleanContent 
     */
    extractHtmlBlocks(cleanContent) {
        // Regex to find blocks matching tag patterns or custom HTML layouts ending in -m
        // Searches for custom components like <div id="player-m">...</div> or <player-m>...</player-m>
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<body>${cleanContent}</body>`, 'text/html');
        
        // Find any elements whose tag name or attributes end with '-m'
        const allElements = doc.body.getElementsByTagName('*');
        
        for (let el of allElements) {
            const tagName = el.tagName.toLowerCase();
            
            if (tagName.endsWith('-m')) {
                this.htmlBlocks.set(tagName, el.outerHTML);
            }
            
            // Check ID or class identifiers ending in -m
            if (el.id && el.id.endsWith('-m')) {
                this.htmlBlocks.set(`id:${el.id}`, el.outerHTML);
            }
        }

        // Alternative: Text-based layout parsing if blocks are explicitly structured as blockName-m { html content }
        if (this.htmlBlocks.size === 0) {
            const textBlockRegex = /([a-zA-Z0-9_-]+-m)\s*\{([\s\S]*?)\}/g;
            let textMatch;
            while ((textMatch = textBlockRegex.exec(cleanContent)) !== null) {
                this.htmlBlocks.set(textMatch[1].trim(), textMatch[2].trim());
            }
        }
    }

    /**
     * Main entry point to process and deploy the HTML mod components
     * @param {string} rawModPayload 
     */
    loadMod(rawModPayload) {
        const lines = rawModPayload.split('\n');
        if (lines.length === 0) return;

        // Line 1 is the metadata config
        this.parseHeader(lines[0]);

        // Remaining content forms the HTML block blueprint
        const bodyContent = lines.slice(1).join('\n');
        const cleanHtml = this.stripHtmlComments(bodyContent);

        this.extractHtmlBlocks(cleanHtml);

        // If the configuration permits execution, inject the blocks into the runtime document
        if (this.config.code !== false) {
            this.injectBlocksToDOM();
        }
    }

    /**
     * Injects the extracted HTML blocks safely into the current web page context
     */
    injectBlocksToDOM() {
        console.log(`HTML Engine active. Deploying ${this.htmlBlocks.size} custom blocks...`);
        
        const container = document.getElementById('mod-runtime-container') || document.body;

        for (let [identifier, htmlContent] of this.htmlBlocks.entries()) {
            console.log(`Deploying block asset: ${identifier}`);
            
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-mod-block-wrapper';
            wrapper.setAttribute('data-mod-id', identifier);
            wrapper.innerHTML = htmlContent;
            
            container.appendChild(wrapper);
        }
    }
}

// Instantiate the global interpreter
const ModEngineInstance = new HTMLModEngine();

// Example UI-less initialization:
// ModEngineInstance.loadMod(rawStringFromYourModMaker);

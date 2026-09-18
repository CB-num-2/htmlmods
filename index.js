/**
 * Headless HTML Mod Engine Core Runtime
 * 
 * This script automatically discovers, processes, sorts, and executes 
 * custom modification packages defined natively inside your HTML document using:
 * <mod-m>, <prefix-m> or <prefix>, <code-m type="js">, and <load-m> tags.
 * 
 * It reads the execution prefix from the script loader URL parameters, handles
 * automatic element tag suffix modifications, and isolates custom elements scopes.
 * 
 * Usage: Load this file via a standard script tag pointing to your Github hosting environment:
 * <script src="https://github.io"></script>
 */

(function() {
    'use strict';

    /**
     * Extracts the target prefix configuration parameter directly from the loading script's URL.
     * Defaults to looking at the specified GitHub Pages path if the script source cannot be parsed.
     * 
     * @returns {string|null} The resolved prefix value (e.g., "-ex"), or null if missing.
     */
    function resolveTargetPrefixFromUrl() {
        // Fallback target identifier string constraint
        const targetBaseUrl = "https://cb-num-2.github.io/htmlmods/index.js";
        
        // Find the script element matching this runtime file instance
        let scriptSrc = "";
        const currentScriptNode = document.currentScript;
        
        if (currentScriptNode && currentScriptNode.src) {
            scriptSrc = currentScriptNode.src;
        } else {
            // Fallback: look for the script tag explicitly linking the GitHub asset path
            const matchingScriptTag = document.querySelector(`script[src^="${targetBaseUrl}"], script[src*="htmlmods/index.js"]`);
            if (matchingScriptTag) {
                scriptSrc = matchingScriptTag.src;
            }
        }

        if (!scriptSrc) return null;

        try {
            // Parse query string parameters safely using the Web URL API
            const urlInstance = new URL(scriptSrc, window.location.href);
            const urlParamPrefix = urlInstance.searchParams.get('prefix');
            
            if (urlParamPrefix) {
                return urlParamPrefix.trim();
            }
        } catch (urlParseError) {
            // Fallback string matching if standard URL instantiation fails within specialized containers
            const regexMatch = scriptSrc.match(/[?&]prefix=([^&#]*)/);
            if (regexMatch && regexMatch[1]) {
                return decodeURIComponent(regexMatch[1]).trim();
            }
        }

        return null;
    }

    /**
     * Scans the document DOM for <mod-m> structural nodes, parses execution parameters,
     * organizes tracking pipelines by assigned weights, and coordinates lifecycle fires.
     */
    function processAndExecuteMods() {
        // Extract the runtime parameter defining which prefix this script run is responsible for executing
        const engineTargetPrefix = resolveTargetPrefixFromUrl();
        
        // Locate all instances of the custom mod component wrapper tag
        const modElements = Array.from(document.querySelectorAll('mod-m'));
        
        if (modElements.length === 0) return;

        const parsedRegistry = [];

        modElements.forEach(modEl => {
            // Skip elements that have already been initialized by the engine runtime loop
            if (modEl.hasAttribute('data-mod-processed')) return;

            // Query structural tag components mapping child specifications (supporting <prefix> fallback from image)
            const prefixNode = modEl.querySelector('prefix-m') || modEl.querySelector('prefix');
            const codeNode = modEl.querySelector('code-m[type="js"]') || modEl.querySelector('code-m');
            const loadNode = modEl.querySelector('load-m');
            
            // Extract the text-token namespace string binding
            const currentModPrefix = prefixNode ? prefixNode.textContent.trim() : null;

            // CRITICAL CHECK: If a loading prefix was found via the script URL parameter,
            // only process the <mod-m> block that strictly matches that prefix target element.
            if (engineTargetPrefix && currentModPrefix !== engineTargetPrefix) {
                return; 
            }

            // Mark matching block as processed by this script target engine instance context
            modEl.setAttribute('data-mod-processed', 'true');

            // Extract manifest metadata values from component configurations
            const name = modEl.getAttribute('name') || 'unnamed-module';
            const version = modEl.getAttribute('version') || '1.0.0';
            const author = modEl.getAttribute('author') || 'unknown';
            
            // Extract pure string code code block characters payload
            let inlineScriptContent = codeNode ? codeNode.textContent : '';

            // Strip out wrapping inline html <script> tags if the user added them inside <code-m>
            inlineScriptContent = inlineScriptContent.replace(/^\s*<script[^>]*>/i, '');
            inlineScriptContent = inlineScriptContent.replace(/<\/script>\s*$/i, '');

            // Extract lifecycle timeline configuration triggers
            const triggerType = loadNode ? loadNode.getAttribute('trigger') : 'Immediate';
            
            // Priority weight formatting default value maps to 50
            let priorityValue = 50;
            if (loadNode && loadNode.hasAttribute('priority')) {
                const parsedWeight = parseInt(loadNode.getAttribute('priority'), 10);
                if (!isNaN(parsedWeight)) {
                    priorityValue = parsedWeight;
                }
            }

            parsedRegistry.push({
                name: name,
                version: version,
                author: author,
                prefix: currentModPrefix,
                scriptText: inlineScriptContent,
                trigger: triggerType,
                priority: priorityValue,
                element: modEl
            });
        });

        // Arrange execution pipelines chronologically by priority weights vector (highest runs first)
        parsedRegistry.sort((modA, modB) => modB.priority - modA.priority);

        // Funnel modular packages safely into their explicit lifecycle trigger scopes
        parsedRegistry.forEach(modItem => {
            switch (modItem.trigger) {
                case 'Immediate':
                    executeScriptPayload(modItem);
                    break;
                    
                case 'DOMReady':
                case 'DOMContentLoaded':
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => executeScriptPayload(modItem));
                    } else {
                        executeScriptPayload(modItem);
                    }
                    break;
                    
                case 'WindowLoad':
                    if (document.readyState !== 'complete') {
                        window.addEventListener('load', () => executeScriptPayload(modItem));
                    } else {
                        executeScriptPayload(modItem);
                    }
                    break;
                    
                default:
                    // Fallback execution default structural safeguard match configuration maps
                    executeScriptPayload(modItem);
                    break;
            }
        });
    }

    /**
     * Safely compiles and injects script logic into isolated closures, binding namespaces
     * and custom element suffix hooks to global windows arrays using defined configurations.
     * 
     * @param {Object} mod Context details object block tracking mod elements
     */
    function executeScriptPayload(mod) {
        // Extra checkpoint flag matching loop parameters runtime configuration
        if (mod.element.hasAttribute('data-mod-executed')) return;
        mod.element.setAttribute('data-mod-executed', 'true');

        // Dynamically instantiate context prefix namespace scopes if explicitly declared
        if (mod.prefix) {
            window[mod.prefix] = window[mod.prefix] || {};
            window[mod.prefix]._manifest = {
                name: mod.name,
                version: mod.version,
                author: mod.author,
                initializedAt: new Date().toISOString()
            };
        }

        // Store standard original native API function pointers reference
        const originalDefine = customElements.define.bind(customElements);
        const originalGet = customElements.get.bind(customElements);
        const originalWhenDefined = customElements.whenDefined.bind(customElements);

        // Intercept global custom element mechanisms safely while executing this module script scope
        const suffixString = mod.prefix ? mod.prefix.trim() : '';
        
        if (suffixString) {
            // Apply a global patch to customElements during execution of this script payload
            customElements.define = function(tagName, constructor, options) {
                const adjustedTagName = tagName.endsWith(suffixString) ? tagName : `${tagName}${suffixString}`;
                return originalDefine(adjustedTagName, constructor, options);
            };

            customElements.get = function(tagName) {
                const adjustedTagName = tagName.endsWith(suffixString) ? tagName : `${tagName}${suffixString}`;
                return originalGet(adjustedTagName);
            };

            customElements.whenDefined = function(tagName) {
                const adjustedTagName = tagName.endsWith(suffixString) ? tagName : `${tagName}${suffixString}`;
                return originalWhenDefined(adjustedTagName);
            };
        }

        try {
            // Wrap the target logic inside a dynamic system closure mapping local arguments
            const sandboxedClosureFunction = new Function(`
                try {
                    ${mod.scriptText}
                } catch (scriptRuntimeError) {
                    console.error("[Mod Runtime Error] Fault caught inside execution stream of mod '${mod.name}':", scriptRuntimeError);
                }
            `);

            // Trigger execution
            sandboxedClosureFunction();
            
            console.log(`[ModEngine] Initialization success: "${mod.name}". Automatically appending custom element tag suffix: "${suffixString}"`);

        } catch (compilationError) {
            console.error(`[ModEngine] Lexical Compilation failure parsing structural text nodes in mod '${mod.name}':`, compilationError);
        } finally {
            // Unconditionally restore pristine base web API behaviors immediately after execution processing completes
            customElements.define = originalDefine;
            customElements.get = originalGet;
            customElements.whenDefined = originalWhenDefined;
        }
    }

    // Automatically orchestrate continuous structural observation checking to catch dynamically appended nodes
    function setupEngineObserver() {
        const structuralDOMObserver = new MutationObserver((mutationsList) => {
            let scanRequired = false;
            
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'MOD-M' || node.querySelector('mod-m')) {
                                scanRequired = true;
                                break;
                            }
                        }
                    }
                }
                if (scanRequired) break;
            }

            if (scanRequired) {
                processAndExecuteMods();
            }
        });

        // Initialize mutation listeners targeted broadly across child node document scopes
        structuralDOMObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Immediate primary execution sequence coordination check
    processAndExecuteMods();

    // Secondary safety hook sequence targeting standard document rendering cycles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAndExecuteMods);
    }

    // Initialize lifecycle node surveillance watchers
    setupEngineObserver();

})();

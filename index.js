/**
 * Headless HTML Mod Engine Core Runtime
 * 
 * This script automatically discovers, processes, sorts, and executes 
 * custom modification packages defined natively inside your HTML document using:
 * <mod-m>, <prefix-m>, <code-m type="js">, and <load-m> tags.
 * 
 * Usage: Load this file via a standard script tag anywhere in your document:
 * <script src="path/to/mod-engine.js"></script>
 */

(function() {
    'use strict';

    /**
     * Scans the document DOM for <mod-m> structural nodes, parses execution parameters,
     * organizes tracking pipelines by assigned weights, and coordinates lifecycle fires.
     */
    function processAndExecuteMods() {
        // Locate all instances of the custom mod component wrapper tag
        const modElements = Array.from(document.querySelectorAll('mod-m'));
        
        if (modElements.length === 0) return;

        const parsedRegistry = [];

        modElements.forEach(modEl => {
            // Skip elements that have already been initialized by the engine runtime loop
            if (modEl.hasAttribute('data-mod-processed')) return;
            modEl.setAttribute('data-mod-processed', 'true');

            // Query structural tag components mapping child specifications
            const prefixNode = modEl.querySelector('prefix-m');
            const codeNode = modEl.querySelector('code-m[type="js"]') || modEl.querySelector('code-m');
            const loadNode = modEl.querySelector('load-m');

            // Extract manifest metadata values from component configurations
            const name = modEl.getAttribute('name') || 'unnamed-module';
            const version = modEl.getAttribute('version') || '1.0.0';
            const author = modEl.getAttribute('author') || 'unknown';
            
            // Extract the text-token namespace string binding
            const prefix = prefixNode ? prefixNode.textContent.trim() : null;
            
            // Extract pure string code code block characters payload
            const inlineScriptContent = codeNode ? codeNode.textContent : '';

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
                prefix: prefix,
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
     * to global windows arrays using defined configurations.
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

        // Access allocated dynamic proxy object space bindings reference vector points
        const activeScopeContext = mod.prefix ? window[mod.prefix] : {};

        try {
            // Wrap the target logic inside a dynamic system closure mapping local arguments
            const sandboxedClosureFunction = new Function('modScope', `
                try {
                    ${mod.scriptText}
                } catch (scriptRuntimeError) {
                    console.error("[Mod Runtime Error] Fault caught inside execution stream of mod '${mod.name}':", scriptRuntimeError);
                }
            `);

            // Trigger the procedural function stack safely passing context pointers tracking arrays
            sandboxedClosureFunction(activeScopeContext);
            
            // Console debugging instrumentation trace
            console.log(`[ModEngine] Initialization success: "${mod.name}" [v${mod.version}] authored by ${mod.author}. Globally bound prefix context -> window.${mod.prefix || 'none'}`);

        } catch (compilationError) {
            console.error(`[ModEngine] Lexical Compilation failure parsing structural text nodes in mod '${mod.name}':`, compilationError);
        }
    }

    // Automatically orchestrate continuous structural observation checking to catch dynamically appended nodes
    function setupEngineObserver() {
        const structuralDOMObserver = new MutationObserver((mutationsList) => {
            let scanRequired = false;
            
            for (const mutation record of mutationsList) {
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

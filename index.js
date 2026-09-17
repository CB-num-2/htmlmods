(function() {
    'use strict';

    // Helper function to safely extract and clean text from custom elements
    function getCleanText(parent, tagName) {
        const el = parent.querySelector(tagName);
        if (!el) return '';
        // Remove text inside custom comment blocks <! ... > if present
        let content = el.innerHTML.replace(/<![\s\S]*?>/g, '');
        // Strip out HTML tags to get pure text content
        content = content.replace(/<[^>]*>/g, '');
        // Clean up multi-line layout formatting and trimmings
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' ');
    }

    // Main compiler execution function
    function compileMods() {
        const mods = document.querySelectorAll('mod-m');
        if (mods.length === 0) return;

        let compiledOutput = '';

        mods.forEach(mod => {
            // 1. Extract values from the structural head-m block
            const title = getCleanText(mod, 'title-m');
            const prefix = getCleanText(mod, 'prefix-m');

            // 2. Extract values from the inner block-m elements
            const sname = getCleanText(mod, 'sname-m');
            const sallowedvalues = getCleanText(mod, 'sallowedvalues-m');
            const binfo = getCleanText(mod, 'binfo-m');
            const codef = getCleanText(mod, 'codef-m');
            const ccodet = getCleanText(mod, 'ccodet-m');

            // 3. Assemble the pieces exactly matching your target format layout
            let modLine = `${title} ${prefix} ${sname} ${sallowedvalues} .> ${binfo} ${codef} ${ccodet}`;
            
            // Clean up any double spaces caused by block transformations
            modLine = modLine.replace(/\s+/g, ' ').trim();

            // Append a user-friendly instruction trailing prefix explanation
            modLine += ` with the prefix, like \` ${prefix} \` to load the ${title} mod.>`;

            compiledOutput += modLine + '\n';
        });

        // Clear the webpage view and display the clean parsed result strings
        document.body.style.fontFamily = 'monospace';
        document.body.style.whiteSpace = 'pre-wrap';
        document.body.style.padding = '20px';
        document.body.textContent = compiledOutput;
    }

    // Auto-run instantly as soon as the DOM structures become accessible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', compileMods);
    } else {
        compileMods();
    }
})();

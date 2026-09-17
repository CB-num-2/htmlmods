(function() {
    'use strict';

    function cleanText(text) {
        if (!text) return '';
        return text.replace(/<![\s\S]*?>/g, '') // Strip custom comments
                   .replace(/<[^>]*>/g, '')      // Strip any inner HTML tags
                   .split('\n')
                   .map(line => line.trim())
                   .filter(line => line.length > 0)
                   .join(' ');
    }

    function compile() {
        const mods = document.querySelectorAll('mod-m');
        if (mods.length === 0) return;

        let finalOutput = '';

        mods.forEach(mod => {
            const titleEl = mod.querySelector('title-m');
            const prefixEl = mod.querySelector('prefix-m');
            const snameEl = mod.querySelector('sname-m');
            const sallowedEl = mod.querySelector('sallowedvalues-m');
            const binfoEl = mod.querySelector('binfo-m');
            const codefEl = mod.querySelector('codef-m');
            const ccodetEl = mod.querySelector('ccodet-m');

            const title = titleEl ? cleanText(titleEl.innerHTML) : '';
            const prefix = prefixEl ? cleanText(prefixEl.innerHTML) : '';
            const sname = snameEl ? cleanText(snameEl.innerHTML) : '';
            
            // For allowed values and block info, preserve spacing boundaries nicely
            const sallowedvalues = sallowedEl ? cleanText(sallowedEl.innerHTML) : '';
            const binfo = binfoEl ? cleanText(binfoEl.innerHTML) : '';
            const codef = codefEl ? cleanText(codefEl.innerHTML) : '';
            const ccodet = ccodetEl ? cleanText(ccodetEl.innerHTML) : '';

            // Construct the exact string representation from your target layout
            let resultStr = `${title} ${prefix} ${sname} ${sallowedvalues} .> ${binfo} ${codef} ${ccodet}`;
            
            // Clean up any accidental double spaces from formatting gaps
            resultStr = resultStr.replace(/\s+/g, ' ').trim();

            // Append the explicit rule message suffix
            resultStr += ` with the prefix, like \` ${prefix} \` to load the ${title} mod.>`;

            finalOutput += resultStr + '\n';
        });

        // Fully replace document body content with the compiled clean text string
        document.body.style.fontFamily = 'monospace';
        document.body.style.whiteSpace = 'pre-wrap';
        document.body.style.padding = '20px';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
        document.body.textContent = finalOutput;
    }

    // Use multiple trigger strategies to guarantee execution regardless of how early the script tag is placed
    if (document.readyState === 'complete') {
        compile();
    } else {
        window.addEventListener('load', compile);
        document.addEventListener('DOMContentLoaded', compile);
    }
})();

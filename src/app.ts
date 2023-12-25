import { Extractor } from './Extractor';

(async () => {
    let extractor: Extractor = new Extractor();
    await extractor.initialize();
})();

const { chromium } = require('playwright');
const path = require('path');

async function captureScreenshots() {
    console.log('Launching browser to capture NeuralSpark UI screenshots...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    const routes = [
        { url: 'http://localhost:3000', name: 'screen_home.png', delay: 2000 },
        { url: 'http://localhost:3000/learning/pyqs', name: 'screen_pyqs.png', delay: 2500 },
        { url: 'http://localhost:3000/learning/quizzes', name: 'screen_quizzes.png', delay: 2500 },
        { url: 'http://localhost:3000/learning/theory', name: 'screen_theory.png', delay: 2500 },
        { url: 'http://localhost:3000/learning/lectures', name: 'screen_lectures.png', delay: 2500 },
        { url: 'http://localhost:3000/upload', name: 'screen_ai_grader.png', delay: 2500 },
        { url: 'http://localhost:3000/forum', name: 'screen_forum.png', delay: 2500 },
        { url: 'http://localhost:3000/about', name: 'screen_about.png', delay: 2000 },
    ];

    for (const item of routes) {
        try {
            console.log(`Capturing ${item.url} -> ${item.name}...`);
            await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(item.delay);
            await page.screenshot({ path: path.join(__dirname, '..', '..', item.name), fullPage: false });
            console.log(`Saved ${item.name}`);
        } catch (e) {
            console.error(`Failed to capture ${item.url}:`, e.message);
        }
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
}

captureScreenshots().catch(console.error);

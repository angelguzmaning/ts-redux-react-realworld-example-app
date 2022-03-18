const puppeteer = require('puppeteer');
const { assert } = require('chai');
const date = Date.now();
//const devices = require('./config/DeviceDescriptors');

console.log('--- Test Started ---')
let browser;
let page;

describe("Conduit - Create New Account and Post an Article", () => {
    it('Conduit_E2E01h_01_Launch_Conduit', async function() {
        browser = await puppeteer.launch({headless: false, slowMo: 5}); //Change headless to true for headless mode //Change slowMo for speed
        page = await browser.newPage();
        await page.goto('http://localhost:3000/#/'); //Navigate to page
        await page.waitForSelector(".preview-link"); //Verifies page has been loaded
        await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_01_LandingPage.png" }); //Takes screenshot of landing page
    });

    it('Conduit_E2E01h_02_Fetch_All_Article_Titles', async function() {
        //Capture and store all existing posts (h1) in Array
        const result = await page.evaluate(() => {
            let FeedTitles = document.querySelectorAll(".preview-link > h1");
            const FeedTitlesArray = [...FeedTitles];
            return FeedTitlesArray.map(h => h.innerText);
        });
    console.log("Titles of all posts: " + result);
    })

    it('Conduit_E2E01h_03_CLICK_Signup_NavBar', async function() {
        const [SignUp] = await page.$x("//a[@class='nav-link'][contains(., 'Sign up')]");

        try {
            await SignUp.click();
            await page.waitForSelector(".btn-primary"); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_03_SignUp_Form.png" }); //Takes screenshot
        } catch(err) {
            console.log("FAILED: Cannot Navigate to Sign Up Form" + err.stack);
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_03_SignUp_Form.png" });
        }
    });

    it('Conduit_E2E01h_04_Enter_Valid_Data_CLICK_SignUp', async function() {
        //Enters and submits valid unique data into form
        await page.type('input[placeholder="Username"]', 'Username' + date, {delay: 20})
        await page.type('input[placeholder="Email"]', 'Email' + date + '@email.com', {delay: 20})
        await page.type('input[placeholder="Password"]', 'Password', {delay: 20})

        const [SignUp] = await page.$x("//button[@class='btn btn-lg btn-primary pull-xs-right'][contains(., 'Sign up')]");
        try {
            await SignUp.click();
            await page.waitForSelector(".home-page"); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_04_SignedUpSuccessfully.png" }); //Takes screenshot
        } catch(err) {
            console.log("FAILED: Cannot Sign Up");
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_04_SignedUp.png" });
            assert.fail(err);
        }
    });

    it('Conduit_E2E01h_05_CLICK_NewArticle_NavBar', async function() {
        const [NewArticle] = await page.$x("//a[@class='nav-link'][contains(., 'New Article')]");
        try {
            await NewArticle.click();
            await page.waitForSelector(".form-group"); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_05_NewArticle.png" }); //Takes screenshot
        } catch(err) {
            console.log("FAILED: Cannot Navigate to New Article page")
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_05_NewArticle.png" });
            assert.fail(err);
        }       
      });

      it('Conduit_E2E01h_06_Enter_ValidData_POSTArticle', async function() {
        //Enters data into form
        await page.type('input[placeholder="Article Title"]', 'Title of My Article', {delay: 20})
        await page.type('input[placeholder="What\'s this article about?"]', 'We should really hire this guy!', {delay: 20})
        await page.type('textarea[placeholder="Write your article (in markdown)"]', '# Hello World!', {delay: 20})
        await page.type('input[placeholder="Enter Tags"]', 'AwesomeWork', {delay: 20})
        
        //Submits Data
        const [PublishArticle] = await page.$x("//button[@class='btn btn-lg btn-primary pull-xs-right'][contains(., 'Publish Article')]");
        try {
            await PublishArticle.click();
            await page.waitForSelector(".form-group"); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_06_PostArticle.png" }); //Takes screenshot
        } catch(err) {
            console.log("FAILED: Cannot Post New Article")
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_06_PostArticle.png" });
            assert.fail(err);
        }        
      });

      it('Conduit_E2E01h_07_CLICK_Home_NavBar', async function(done) {
        const [Home] = await page.$x("//a[@class='nav-link'][contains(., 'Home')]");

        try {
            await Home.click();
            //Validates the correct page gets displayed and takes screenshot
            await page.waitForSelector(".btn-primary");
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
        } catch(err) {
            console.log("FAILED: Cannot Navigate to Home Page")
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
            assert.fail(err);
        }      
      });

      it('Conduit_E2E01h_08_CLICK_GlobalFeed_Tab', async function(done) {
        const [GlobalFeed] = await page.$x("//a[@class='nav-link'][contains(., 'Global Feed')]");

        try {
            await GlobalFeed.click();
            //Validates the correct page gets displayed and takes screenshot
            await page.waitForSelector(".btn-primary");
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_08_CLICK_GlobalFeed_Tab.png" });
        } catch(err) {
            console.log("FAILED: Cannot Navigate to Global Feed")
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_08_CLICK_GlobalFeed_Tab.png" });
            assert.fail(err);
        }   
      });

      it('Conduit_E2E01h_09_Fetch_All_Article_Titles_2', async function() {
        //Capture and store all existing posts (h1) in Array
        const result = await page.evaluate(() => {
            let FeedTitles = document.querySelectorAll(".preview-link > h1");
            const FeedTitlesArray = [...FeedTitles];
            return FeedTitlesArray.map(h => h.innerText);
        });
        console.log("Titles of all posts: " + result);
    })
});
/**
* This file is where we will put most of the basic main tests for the website
* 
* Links:
* https://webdriver.io/docs/gettingstarted.html
* https://webdriver.io/docs/sync-vs-async.html
* https://webdriver.io/blog/2019/04/03/react-selectors.html
*
* READ INSTRUCTIONS TO EXECUTE TESTS
* ----------------------------------
* 1) Locate to the home directory of fuo-backend
* 2) From the root directory of fuo-backend, execute the command "npx wdio wdio.conf.js"
*
* Contributors: Derek Ta
*/

/*Main Test - Just verifies the main page loads correctly*/
/*This is a redundant test for the purpose of showing how to start writing tests*/
const TEAM_HEROKU_URL = 'https://corona-food.herokuapp.com';

describe('test_main', () => {
    it('should have the right title', () => {
        /*Opens the browser URL*/
        browser.url(TEAM_HEROKU_URL)
        const title = browser.getTitle()
        expect(browser).toHaveTitle('WebdriverIO · Next-gen browser and mobile automation test framework for Node.js');
    })
})

/**
* This file is where we will put most of the basic main tests for the website
* 
* Links:
* https://webdriver.io/docs/gettingstarted.html
* https://webdriver.io/docs/sync-vs-async.html
* https://webdriver.io/blog/2019/04/03/react-selectors.html
*
* Examples of React webdriver.io test
* https://github.com/klamping/react-webdriverio-tests/blob/master/test/input-change-events.test.js
*
* READ INSTRUCTIONS TO EXECUTE TESTS
* ----------------------------------
* 1) Locate to the home directory of fuo-backend
* 2) From the root directory of fuo-backend, execute the command "npx wdio wdio.conf.js"
*
* Contributors: Derek Ta, Shawn, Jeet
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
    it('Main page should have correct Title', () => {
        /* Opens the browser URL */
        browser.url(TEAM_HEROKU_URL)
        const title = browser.getTitle()
        expect(browser).toHaveTitle('Stop Food Waste');
    })

    it('Tab', () => {
        /* Opens the browser URL*/
        browser.url(TEAM_HEROKU_URL);
        const myButton = $('#simple-tab-1');
        myButton.click()

    })

    it('The back button should go to landing page', () => {
        /*Opens the browser URL*/
        browser.url(TEAM_HEROKU_URL);
        const myButton = $('#accounts-back');
        myButton.click();
        expect(browser).toHaveUrl('https://corona-food.herokuapp.com/landing.html%27');
    })

    it('The back button should go to lane', () => {
        /*Opens the browser URL*/
        browser.url(TEAM_HEROKU_URL);
        const toggleButton = $('button *= Sign Up');

    })
})
/* Testing login and logout - Shawn */
describe('Authentication Test Suite', function(){
    it('should click on the login button and login form presented', function() {
      return browser
        .url(TEAM_HEROKU_URL)
        .click('#login')
        .getText('#login-form-submit')
        .should.eventually.be.equal('LOGIN');
    });

  it('should click on the login button submit login info and a logout link is visible', function() {
    return browser
      .url(TEAM_HEROKU_URL)
      .setValue('#Email Address', 'moo@MooMooInc.com')
      .setValue('#Password', 'moomoo123')
      .click('#LOGIN')
      .waitForVisible('#LOGOUT', 3000)
      .getText('#LOGOUT')
      .should.eventually.be.equal('Logout');
  });

  it('should logout when logout link is clicked', function() {
    return browser
      .url(TEAM_HEROKU_URL)
      .getText('#logout-text')
      .should.eventually
      .be.equal("You are now logged out. Thank you for visiting."); // NEED TO HAVE THE RIGHT MESSAGE
  });

});

//Testing if pop up for add location pops up -Shawn
describe('test_add_location', () => {
    /* Testing ADD LOCATION button */
    it('expect add a location pop up', () => {
        /*Opens the browser URL*/
        browser.url('http://localhost:3000/business');
        const myButton = $('button *= ADD LOCATION');
        myButton.click();
        // assertion to be TBD
    })

    /* Testing LOG OUT button */
    it('logout', () => {
        /*Opens the browser URL*/
        browser.url('http://localhost:3000/business');
        const myButton = $('button *= LOG OUT');
        myButton.click();
        // assertion to be TBD
    })

    /* Testing UPDATE LIST button */
    it('logout', () => {
        /*Opens the browser URL*/
        browser.url('http://localhost:3000/business');
        const myButton = $('button *= UPDATE LOCATION');
        myButton.click();
        // assertion to be TBD
    })

    /* Testing DELETE LOCATION button */
    it('logout', () => {
        /*Opens the browser URL*/
        browser.url('http://localhost:3000/business');
        const myButton = $('button *= DELETE LOCATION');
        myButton.click();
        // assertion to be TBD
    })
})

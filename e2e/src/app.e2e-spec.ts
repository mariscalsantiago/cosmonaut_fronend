import { AppPage } from './app.po';
import { browser, by, element, logging } from 'protractor';
/*describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toEqual('cosmonaut-front app is running!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});*/
describe('workspace-project App', () => {
  it('Login exitoso', () => {
    // browser.get('http://localhost:4200');
    // element(by.id('exampleInputEmail1')).sendKeys('juan@perez.com');
    // element(by.id('exampleInputPassword1')).sendKeys('123456789');
    // element(by.css('button')).click().then(() => {
    //   //expect(element(by.css('body')).getText()).toContain('inicio works!');
    // });


    // element(by.id('exampleInputPassword1')).getText().then(datos => {
    //   expect(datos).toContain("");
    // });


    // afterEach(async () => {
    //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    //   expect(logs).not.toContain(jasmine.objectContaining({
    //     level: logging.Level.SEVERE,
    //   } as logging.Entry));
    // });


   

  });
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  }
  );





});


describe('verificadno titulos',()=>{

  it('Tiene un titulo nene', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');

    expect(browser.getTitle()).toContain('Super Calculator');
  });

})

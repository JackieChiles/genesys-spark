import { E2EPage } from '@stencil/core/testing';

import { a11yCheck, newSparkE2EPage } from '../../../../test/e2eTestUtils';

const html = `
<gux-context-menu-beta>
  <gux-list-item id="list-item-1" onclick="notify(event)">Test 1</gux-list-item>
  <gux-list-item id="list-item-2" onclick="notify(event)">Test 2</gux-list-item>
  <gux-list-item id="list-item-3" onclick="notify(event)">Test 3</gux-list-item>
</gux-context-menu-beta>
`;

const guxListSelector = 'pierce/gux-list';
const buttonSelector = 'pierce/gux-button-slot-beta button';

describe('gux-context-menu-beta', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newSparkE2EPage({ html });
  });

  it('renders', async () => {
    const element = await page.find('gux-context-menu-beta');

    expect(element).toHaveAttribute('hydrated');
  });

  it('should be a11y compliant', async () => {
    const element = await page.find('gux-context-menu-beta');

    await a11yCheck(page, [], 'before opening context menu');
    await element.click();
    await page.waitForChanges();

    await a11yCheck(page, [], 'after opening context menu');
  });

  it('should focus first item in list on click', async () => {
    const element = await page.find('gux-context-menu-beta');
    const expectedElementWithFocus = await page.find(
      'gux-list-item:first-of-type'
    );

    await element.click();
    await page.waitForChanges();

    const actualElementWithFocus = await element.find(':focus');
    const isMenuVisible = await (await page.find(guxListSelector)).isVisible();

    expect(isMenuVisible).toBe(true);
    expect(actualElementWithFocus.id).toEqual(expectedElementWithFocus.id);
  });

  it('should focus last item in list on ArrowUp keypress', async () => {
    const button = await page.find(buttonSelector);
    const expectedElementWithFocus = await page.find(
      'gux-list-item:last-of-type'
    );

    await button.press('ArrowUp');
    await page.waitForChanges();

    const actualElementWithFocus = await page.find(':focus');
    const isMenuVisible = await (await page.find(guxListSelector)).isVisible();

    expect(isMenuVisible).toBe(true);
    expect(actualElementWithFocus.id).toEqual(expectedElementWithFocus.id);
  });

  ['Enter', 'ArrowDown', ' '].forEach(key => {
    it(`should open menu and focus first item in list on keypress: ${key}`, async () => {
      const button = await page.find(buttonSelector);
      const expectedElementWithFocus = await page.find(
        'gux-list-item:first-of-type'
      );

      await button.press(key);
      await page.waitForChanges();

      const actualElementWithFocus = await page.find(':focus');
      const isMenuVisible = await (
        await page.find(guxListSelector)
      ).isVisible();

      expect(isMenuVisible).toBe(true);
      expect(actualElementWithFocus.id).toEqual(expectedElementWithFocus.id);
    });
  });

  it('should close menu and move focus to button on Escape', async () => {
    await (await page.find('gux-context-menu-beta')).click();

    const list = await page.find(guxListSelector);

    expect(await list.isVisible()).toBe(true);

    await list.press('Escape');
    await page.waitForChanges();

    const actualElementWithFocus = await page.find(':focus');

    expect(await list.isVisible()).toBe(false);
    expect(actualElementWithFocus.nodeName).toEqual('GUX-CONTEXT-MENU-BETA');
  });

  it('should close menu on Tab keypress', async () => {
    const element = await page.find('gux-context-menu-beta');
    const list = await element.find(guxListSelector);

    await element.click();

    expect(await list.isVisible()).toBe(true);

    await element.press('Tab');
    await page.waitForChanges();

    expect(await list.isVisible()).toBe(false);
  });
});

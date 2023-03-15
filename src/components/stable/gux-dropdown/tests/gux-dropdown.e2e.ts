import { E2EPage } from '@stencil/core/testing';
import { newSparkE2EPage, a11yCheck } from '../../../../test/e2eTestUtils';

testWithOptionType(
  'gux-option',
  `
<gux-option value="a">Ant</gux-option>
<gux-option value="b">Bear</gux-option>
<gux-option value="be">Bee</gux-option>
<gux-option value="c">Cat</gux-option>
`
);

testWithOptionType(
  'gux-option-icon',
  `
<gux-option-icon icon-name="user" value="a">Ant</gux-option-icon>
<gux-option-icon icon-name="user" value="b">Bear</gux-option-icon>
<gux-option-icon icon-name="user" value="be">Bee</gux-option-icon>
<gux-option-icon icon-name="user" value="c">Cat</gux-option-icon>
`
);

function testWithOptionType(optionType: string, listboxContent: string) {
  describe(`gux-dropdown with ${optionType}`, () => {
    describe('#render', () => {
      it('renders', async () => {
        const { dropdown } = await render(
          nonFilterableDropdown(listboxContent)
        );
        expect(dropdown).toHaveAttribute('hydrated');
      });
    });

    describe('filterable', () => {
      it('renders', async () => {
        const { dropdown } = await render(
          filterablePrefixDropdown(listboxContent)
        );
        expect(dropdown).toHaveAttribute('hydrated');
      });

      it('opens dropdown on click', async () => {
        const { page } = await render(filterablePrefixDropdown(listboxContent));

        await a11yCheck(page, [], 'before opening dropdown with filter');
        await openWithClick(page);
        await a11yCheck(page, [], 'after opening dropdown with filter');

        const dropMenu = await page.find('pierce/.gux-popup-container');
        expect(dropMenu.className.split(' ')).toContain('gux-expanded');
      });

      it('filters items in the dropdown', async () => {
        const { page } = await render(filterablePrefixDropdown(listboxContent));
        await openWithClick(page);

        let visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(4);

        await page.keyboard.press('b');
        await page.waitForChanges();

        visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(2);
        expect(visibleItems[0].textContent).toEqual('Bear');
      });

      it('does not filter items when filter type is custom', async () => {
        const { page } = await render(filterableCustomDropdown(listboxContent));
        await openWithClick(page);

        let visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(4);

        await page.keyboard.press('b');
        await page.waitForChanges();

        visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(4);
        expect(visibleItems[0].textContent).toEqual('Ant');
      });
      // remove in V4 (COMUI-1369)
      it('is backwards compatible with filterable property', async () => {
        const { page } = await render(filterableDropdown(listboxContent));
        await openWithClick(page);

        let visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(4);

        await page.keyboard.press('b');
        await page.waitForChanges();

        visibleItems = await unfilteredOptions(page, optionType);
        expect(visibleItems.length).toBe(2);
        expect(visibleItems[0].textContent).toEqual('Bear');
      });
    });

    describe('click', () => {
      it('opens drop down on click', async () => {
        const { page } = await render(nonFilterableDropdown(listboxContent));

        await a11yCheck(page, [], 'before opening dropdown');
        await openWithClick(page);
        await a11yCheck(page, [], 'after opening dropdown');

        await expectDropdownToBeOpen(page);
      });
    });

    describe('press', () => {
      it('opens and closes dropdown on keypress', async () => {
        const { page } = await render(nonFilterableDropdown(listboxContent));
        await openWithKeyboard(page);

        await expectDropdownToBeOpen(page);

        const dropdownMenu = await page.find('pierce/.gux-popup-container');
        await dropdownMenu.press('Escape');

        await expectDropdownToBeClosed(page);
      });

      it('focuses the listbox when down arrow is pressed', async () => {
        const { page } = await render(nonFilterableDropdown(listboxContent));
        await openWithKeyboard(page);

        const listbox = await page.find('gux-dropdown gux-listbox');
        const focusEl = await page.find(':focus');

        expect(listbox.outerHTML).toContain(focusEl.outerHTML);
      });

      it('moves between options when arrow keys are pressed', async () => {
        const { page } = await render(nonFilterableDropdown(listboxContent));
        await openWithKeyboard(page);

        const listbox = await page.find('gux-dropdown gux-listbox');
        const listboxItems = await page.findAll(
          `gux-dropdown gux-listbox ${optionType}`
        );

        let activeItem = await listbox.findAll('.gux-active');

        expect(activeItem.length).toBe(1);
        expect(activeItem[0].outerHTML).toContain(listboxItems[0].outerHTML);

        await activeItem[0].press('ArrowDown');
        activeItem = await listbox.findAll('.gux-active');

        expect(activeItem[0].outerHTML).toContain(listboxItems[1].outerHTML);
      });

      it('selects listbox options on keypress', async () => {
        const { page } = await render(nonFilterableDropdown(listboxContent));
        await openWithKeyboard(page);

        let listboxItems = await page.findAll(
          `gux-dropdown gux-listbox ${optionType}`
        );
        let selectedItem = await page.findAll('.gux-selected');
        expect(selectedItem.length).toBe(0);

        await page.keyboard.press('Enter');
        await expectDropdownToBeClosed(page);

        await openWithKeyboard(page);

        selectedItem = await page.findAll('.gux-selected');
        listboxItems = await page.findAll(
          `gux-dropdown gux-listbox ${optionType}`
        );

        expect(selectedItem.length).toBe(1);
        expect(selectedItem[0].outerHTML).toContain(listboxItems[0].outerHTML);
      });
    });
  });
}

// Helpers
async function render(content: string) {
  const page = await newSparkE2EPage({ html: content });
  await page.waitForChanges();
  const dropdown = await page.find('gux-dropdown');
  return { page, dropdown };
}

async function openWithClick(page: E2EPage) {
  const dropdownButtonElement = await page.find('pierce/.gux-field');
  await dropdownButtonElement.click();
  await page.waitForChanges();
}

async function openWithKeyboard(page: E2EPage) {
  const dropdownButtonElement = await page.find('pierce/.gux-field');
  await dropdownButtonElement.press('ArrowDown');
}

async function unfilteredOptions(page: E2EPage, optionType: string) {
  return await page.findAll(
    `gux-dropdown gux-listbox ${optionType}:not(.gux-filtered)`
  );
}

async function expectDropdownToBeOpen(page: E2EPage) {
  const dropdownMenu = await page.find('pierce/.gux-popup-container');
  expect(dropdownMenu.className.split(' ')).toContain('gux-expanded');
}

async function expectDropdownToBeClosed(page: E2EPage) {
  const dropMenu = await page.find('pierce/.gux-popup-container');
  await dropMenu.press('Escape');
  expect(dropMenu.className.split(' ')).not.toContain('gux-expanded');
}

function nonFilterableDropdown(listboxContent: string) {
  return `
<gux-dropdown lang="en" value="j">
  <gux-listbox aria-label="Favorite Animal">
    ${listboxContent}
  </gux-listbox>
  </gux-dropdown>
`;
}

// remove in V4 (COMUI-1369)
function filterableDropdown(listboxContent: string) {
  return `
<gux-dropdown filterable filter-type="starts-with" lang="en" value="j">
  <gux-listbox aria-label="Favorite Animal">
  ${listboxContent}
  </gux-listbox>
</gux-dropdown>
`;
}

function filterablePrefixDropdown(listboxContent: string) {
  return `
<gux-dropdown filter-type="starts-with" lang="en" value="j">
  <gux-listbox aria-label="Favorite Animal">
    ${listboxContent}
  </gux-listbox>
</gux-dropdown>
`;
}

function filterableCustomDropdown(listboxContent: string) {
  return `
<gux-dropdown filter-type="custom" lang="en" value="j">
  <gux-listbox aria-label="Favorite Animal">
    ${listboxContent}
  </gux-listbox>
</gux-dropdown>
  `;
}

import { newE2EPage } from '@stencil/core/testing';

describe('gux-skip-navigation-list-beta', () => {
  it('renders', async () => {
    const html = `
    <gux-skip-navigation-list-beta>
      <gux-skip-navigation-item>
        <a href="#" onclick="notify(event)">Navigation Link 1</a>
      </gux-skip-navigation-item>
      <gux-skip-navigation-item>
        <a href="#" onclick="notify(event)">Navigation Link 2 that is long</a>
      </gux-skip-navigation-item>
      <gux-skip-navigation-item>
        <a href="#" onclick="notify(event)">Navigation Link 3</a>
      </gux-skip-navigation-item>
      <gux-skip-navigation-item>
        <a href="#" onclick="notify(event)">Link 4</a>
      </gux-skip-navigation-item>
    </gux-skip-navigation-list-beta>
  `;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-skip-navigation-list-beta');

    expect(element.innerHTML).toMatchSnapshot();
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { GuxLoadingMessage } from '../gux-loading-message';

const components = [GuxLoadingMessage];
const language = 'en';

describe('gux-loading-message-beta', () => {
  it('should build', async () => {
    const html = `<gux-loading-message-beta>
        <span slot="primary-message">The content is loading...</span>
        <span slot="additional-guidance">Thank you for waiting.</span>
        <gux-radial-progress slot="progress" />
        </gux-loading-message-beta>`;
    const page = await newSpecPage({ components, language, html });
    const component = page.rootInstance;

    expect(component).toBeInstanceOf(GuxLoadingMessage);
  });

  describe('#render', () => {
    it(`should render the component as expected`, async () => {
      const html = `<gux-loading-message-beta>
            <span slot="primary-message">The content is loading...</span>
            <span slot="additional-guidance">Thank you for waiting.</span>
            <gux-radial-progress slot="progress" />
            </gux-loading-message-beta>`;
      const page = await newSpecPage({ components, language, html });

      expect(page.root).toMatchSnapshot();
    });
  });
});

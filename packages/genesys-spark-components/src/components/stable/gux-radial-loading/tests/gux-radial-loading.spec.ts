import { newSpecPage } from '@test/specTestUtils';
import { GuxRadialLoading } from '../gux-radial-loading';

describe('gux-radial-loading', () => {
  let component: GuxRadialLoading;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxRadialLoading],
      html: `<gux-radial-loading></gux-radial-loading>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxRadialLoading);
  });

  describe('#render', () => {
    [
      '<gux-radial-loading screenreader-text="Loading"></gux-radial-loading>',
      '<gux-radial-loading context="modal" screenreader-text="Loading"></gux-radial-loading>',
      '<gux-radial-loading context="full-page" screenreader-text="Loading"></gux-radial-loading>',
      '<gux-radial-loading context="input" screenreader-text="Loading"></gux-radial-loading>'
    ].forEach((input, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({
          components: [GuxRadialLoading],
          html: input,
          language: 'en'
        });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});

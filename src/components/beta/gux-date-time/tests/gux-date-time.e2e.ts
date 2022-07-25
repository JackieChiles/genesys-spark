import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

const date = new Date(2022, 6, 7, 9, 35, 30, 100).toISOString();

describe('gux-date-time-beta', () => {
  describe('#render', () => {
    [
        `<gux-date-time-beta datetime=${date} format="short"></gux-date-time-beta>`,
        `<gux-date-time-beta datetime=${date} format="medium"></gux-date-time-beta>`,
        `<gux-date-time-beta datetime=${date} format="long"></gux-date-time-beta>`,
        `<gux-date-time-beta datetime=${date} format="full"></gux-date-time-beta>`
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSparkE2EPage({ html });
        await a11yCheck(page);

        const element = await page.find('gux-date-time-beta');
        expect(element.outerHTML).toMatchSnapshot();
      });
    });
  });
});

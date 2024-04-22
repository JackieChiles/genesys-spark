import { Component, JSX, h, Host, Prop, Element } from '@stencil/core';
import { trackComponent } from '@utils/tracking/usage';
import {
  DateTimeFormatter,
  GuxDateTimeFormat
} from '../../../i18n/DateTimeFormatter';
import * as sparkIntl from '../../../genesys-spark-utils/intl';
// Remove with this ticket https://inindca.atlassian.net/browse/COMUI-2598
import { useRegionalDates } from '../../../i18n/use-regional-dates';
import { getDesiredLocale } from '../../../i18n/index';
import { GuxTimeZoneIdentifier } from '../../../i18n/time-zone/types';
import { getValidTimezone } from '@utils/date/get-valid-timezone';

@Component({
  tag: 'gux-date-beta',
  shadow: true
})
export class GuxDate {
  private formatter: DateTimeFormatter;
  private hasRegionalDatesCookie: boolean = false;

  /**
   * Reference to the host element.
   */
  @Element()
  root: HTMLElement;

  /**
   * The ISO string representation of the date to format
   */
  @Prop()
  datetime: string = new Date().toISOString();

  /**
   * Format option type
   */
  @Prop()
  format: GuxDateTimeFormat = 'short';

  /**
   * Time zone identifier
   */
  @Prop()
  timeZone: GuxTimeZoneIdentifier;

  componentWillLoad(): void {
    trackComponent(this.root);
    if (useRegionalDates()) {
      this.hasRegionalDatesCookie = true;
    } else {
      this.formatter = new DateTimeFormatter(getDesiredLocale(this.root));
    }
  }

  private renderDate(): JSX.Element {
    if (this.hasRegionalDatesCookie) {
      return sparkIntl
        .dateTimeFormat(sparkIntl.determineDisplayLocale(this.root), {
          dateStyle: this.format,
          timeZone: getValidTimezone(this.timeZone)
        })
        .format(new Date(this.datetime));
    } else {
      return this.formatter.formatDate(new Date(this.datetime), this.format, {
        timeZone: getValidTimezone(this.timeZone)
      });
    }
  }

  render() {
    return (<Host>{this.renderDate()}</Host>) as JSX.Element;
  }
}

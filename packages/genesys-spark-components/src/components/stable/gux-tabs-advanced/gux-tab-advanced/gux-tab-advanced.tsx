import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  writeTask
} from '@stencil/core';

import { eventIsFrom } from '@utils/dom/event-is-from';
import { randomHTMLId } from '@utils/dom/random-html-id';
import { afterNextRenderTimeout } from '@utils/dom/after-next-render';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';

import tabsResources from '../i18n/en.json';

/**
 * @slot default - gux-icon (optional) and text node (required)
 * @slot dropdown-options - optional slot for tab options, must slot a gux-list element with gux-list-item children
 */

@Component({
  styleUrl: 'gux-tab-advanced.scss',
  tag: 'gux-tab-advanced',
  shadow: true
})
export class GuxTabAdvanced {
  private tabOptionsButtonElement: HTMLButtonElement;
  private dropdownOptionsButtonId: string = randomHTMLId();
  private tabTitle: string = '';

  @Element()
  private root: HTMLElement;

  /**
   * unique id for the tab
   */
  @Prop()
  tabId: string;

  /**
   * indicates whether or not the tab is selected
   */
  @State()
  active: boolean = false;

  @Prop()
  guxDisabled: boolean = false;

  @State()
  private popoverHidden: boolean = true;

  @State()
  private hasAnimated: boolean = false;

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        if (
          !eventIsFrom('gux-tab-advanced', event) &&
          !eventIsFrom('gux-list-item', event)
        ) {
          event.preventDefault();
          this.popoverHidden = false;
          this.focusFirstItemInPopupList();
        }
        break;
      case 'Escape':
        if (eventIsFrom('gux-list[slot="dropdown-options"]', event)) {
          event.stopPropagation();
          this.popoverHidden = true;
          afterNextRenderTimeout(() => {
            this.tabOptionsButtonElement?.focus();
          });
        }
        break;
    }
  }

  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        if (!eventIsFrom('gux-tab-advanced-title', event)) {
          this.focusFirstItemInPopupList();
        }
    }
  }

  @Event()
  internalactivatetabpanel: EventEmitter<string>;

  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async guxSetActive(active: boolean): Promise<void> {
    this.active = active;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async guxGetActive() {
    return this.active;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async guxFocus(): Promise<void> {
    this.root.querySelector('gux-tab-advanced-title')?.focus();
  }

  private get hasDropdownOptions(): boolean {
    return Boolean(
      this.root.querySelector('gux-list[slot="dropdown-options"]')
    );
  }

  private focusFirstItemInPopupList(): void {
    const listElement: HTMLGuxListElement = this.root.querySelector(
      'gux-list[slot="dropdown-options"]'
    );
    afterNextRenderTimeout(() => {
      void listElement?.guxFocusFirstItem();
    });
  }

  private toggleOptions(): void {
    this.popoverHidden = !this.popoverHidden;
  }

  private onSelectDropdownOption(e: MouseEvent): void {
    this.popoverHidden = true;
    e.stopPropagation();
    afterNextRenderTimeout(() => {
      this.tabOptionsButtonElement.focus();
    });
  }

  private i18n: GetI18nValue;

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(
      this.root,
      tabsResources,
      'gux-tabs-advanced'
    );
  }

  componentDidLoad(): void {
    this.tabTitle = this.root.shadowRoot
      .querySelector('slot')
      .textContent?.trim();
    if (!this.hasAnimated) {
      writeTask(() => {
        this.root.shadowRoot
          .querySelector('.gux-tab')
          .classList.add('gux-show');
        this.hasAnimated = true;
      });
    }
  }

  private popoverOnClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  private getDropdownOptions(): JSX.Element {
    if (this.hasDropdownOptions) {
      return [
        <button
          id={this.dropdownOptionsButtonId}
          aria-expanded={(!this.popoverHidden).toString()}
          type="button"
          class="gux-tab-options-button"
          ref={el => (this.tabOptionsButtonElement = el)}
          onClick={() => this.toggleOptions()}
          tabIndex={this.active ? 0 : -1}
          disabled={this.guxDisabled}
        >
          <gux-icon
            icon-name="menu-kebab-vertical"
            screenreader-text={this.i18n('options', {
              tabTitle: this.tabTitle
            })}
          ></gux-icon>
        </button>,
        <gux-popover-list
          position="top-end"
          for={this.dropdownOptionsButtonId}
          displayDismissButton={false}
          isOpen={!this.popoverHidden}
          closeOnClickOutside={true}
          onGuxdismiss={() => (this.popoverHidden = true)}
          onClick={(e: MouseEvent) => this.popoverOnClick(e)}
          onFocusout={e => e.stopImmediatePropagation()}
        >
          <div
            class="gux-dropdown-option-container"
            onClick={(e: MouseEvent) => this.onSelectDropdownOption(e)}
          >
            <slot name="dropdown-options" />
          </div>
        </gux-popover-list>
      ] as JSX.Element;
    }

    return null;
  }

  render(): JSX.Element {
    return [
      <div
        class={{
          'gux-tab': true,
          'gux-selected': this.active,
          'gux-dropdown-options': this.hasDropdownOptions,
          'gux-disabled': this.guxDisabled
        }}
      >
        <div class="gux-tab-title-slot-container">
          <slot />
        </div>
        <div>{this.getDropdownOptions()}</div>
        <div class="gux-divider"></div>
      </div>
    ] as JSX.Element;
  }
}

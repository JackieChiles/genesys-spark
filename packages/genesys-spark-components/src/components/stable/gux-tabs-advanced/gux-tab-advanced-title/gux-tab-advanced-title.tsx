import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  writeTask
} from '@stencil/core';

// import { eventIsFrom } from '@utils/dom/event-is-from';
// import { randomHTMLId } from '@utils/dom/random-html-id';
// import { afterNextRenderTimeout } from '@utils/dom/after-next-render';

/**
 * @slot default - gux-icon (optional) and text node (required)
 * @slot dropdown-options - optional slot for tab options, must slot a gux-list element with gux-list-item children
 */

@Component({
  styleUrl: 'gux-tab-advanced-title.scss',
  tag: 'gux-tab-advanced-title',
  shadow: true
})
export class GuxTabAdvancedTitle {
  private buttonElement: HTMLElement;
  // private tabOptionsButtonElement: HTMLButtonElement;
  private tooltipTitleElement: HTMLGuxTooltipTitleElement;
  private tabTitle: string = '';
  private focusinFromClick: boolean = false;

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

  // @State()
  // private popoverHidden: boolean = true;

  @State()
  private hasAnimated: boolean = false;

  @Listen('focusin')
  onFocusin(event: FocusEvent) {
    if (
      !this.focusinFromClick &&
      (event.target as HTMLElement).classList.contains('gux-tab-button')
    ) {
      void this.tooltipTitleElement.setShowTooltip();
    }
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        event.preventDefault();
        break;
      case 'Enter':
        if (!this.active && !this.guxDisabled) {
          this.internalactivatetabpanel.emit(this.tabId);
        }
        break;
    }
  }
  @Listen('click')
  onClick() {
    if (!this.active && !this.guxDisabled) {
      this.internalactivatetabpanel.emit(this.tabId);
    }
  }

  @Listen('mousedown')
  onMouseDown() {
    this.focusinFromClick = true;
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
    this.buttonElement.focus();
  }

  componentDidLoad(): void {
    const parentElement = this.root.parentElement as HTMLGuxTabAdvancedElement;
    this.tabId = parentElement.tabId;
    console.log(this.tabTitle);
    this.tabTitle = this.root.shadowRoot
      .querySelector('gux-tooltip-title')
      .textContent.trim();
    if (!this.hasAnimated) {
      writeTask(() => {
        this.root.classList.add('gux-show');
        this.hasAnimated = true;
      });
    }
  }

  render(): JSX.Element {
    return (
      <Host
        class={{
          'gux-tab': true,
          'gux-selected': this.active,
          'gux-disabled': this.guxDisabled
        }}
        type="button"
        role="tab"
        aria-selected={this.active.toString()}
        aria-disabled={this.guxDisabled.toString()}
        aria-controls={`gux-${this.tabId}-panel`}
        ref={el => (this.buttonElement = el)}
        tabIndex={this.active ? 0 : -1}
        id={`gux-${this.tabId}-tab`}
      >
        <div class="gux-tooltip-title-container">
          <gux-tooltip-title
            class="gux-tab-tooltip-title"
            ref={el => (this.tooltipTitleElement = el)}
          >
            <span>
              <slot />
            </span>
          </gux-tooltip-title>
        </div>
      </Host>
    ) as JSX.Element;
  }
}

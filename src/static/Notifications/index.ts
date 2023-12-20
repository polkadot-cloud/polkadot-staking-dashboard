// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export class Notifications {
  // Store the elements that are listening to notification events.
  private static subscribers = new Map<string, HTMLElement>();

  // Add a new notification to the list.
  static subscribeElement(id: string, element: HTMLElement) {
    this.subscribers.set(id, element);
  }

  // Emit a new notification to all subscribed elements.
  static emitNotification() {
    // for (const el of this.subscribers.values()) {
    document.dispatchEvent(
      new CustomEvent('notification', {
        detail: {
          title: 'Notification Title',
          subtitle: 'Notification Subtitle',
        },
      })
    );
    // }
  }
}

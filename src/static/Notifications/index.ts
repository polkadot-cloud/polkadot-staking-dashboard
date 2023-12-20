// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// A class to manage notifications.
//
// Designed to emit notifications to subscribers to the `notification` event.
export class Notifications {
  // Store the elements that are listening to notification events.
  // NOTE: Currently not in use.
  private static subscribers = new Map<string, HTMLElement>();

  // Store how long a notification should remain displayed for.
  private static displayDuration = 3000;

  // Store the notification indexes.
  private static indexes: number[] = [];

  // Add a new notification to the list.
  // NOTE: Currently not in use.
  static addSubscriber(id: string, element: HTMLElement) {
    this.subscribers.set(id, element);
  }

  // Emit a new notification to all subscribed elements.
  static emitNotification() {
    const index = (this.indexes[this.indexes.length - 1] || 0) + 1;
    this.indexes.push(index);

    // Emit the notification.
    document.dispatchEvent(
      new CustomEvent('notification', {
        detail: {
          task: 'add',
          index,
          title: 'Notification Title',
          subtitle: 'Notification Subtitle',
        },
      })
    );

    // After a period of time, dismiss the notification.
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent('notification', {
          detail: {
            task: 'dismiss',
            index,
          },
        })
      );
    }, this.displayDuration);
  }
}

/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

describe('inAppMessaging()', function () {
  describe('v8 compatibility', function () {
    describe('namespace', function () {
      it('accessible from firebase.app()', function () {
        const app = firebase.app();
        should.exist(app.inAppMessaging);
        app.inAppMessaging().app.should.equal(app);
      });
    });

    describe('setAutomaticDataCollectionEnabled()', function () {
      // These depend on `tests/firebase.json` having `in_app_messaging_auto_collection_enabled` set to false the first time
      // The setting is persisted across restarts, reset to false after for local runs where prefs are sticky
      afterEach(async function () {
        await firebase.inAppMessaging().setAutomaticDataCollectionEnabled(false);
      });

      it('true', async function () {
        should.equal(firebase.inAppMessaging().isAutomaticDataCollectionEnabled, false);
        await firebase.inAppMessaging().setAutomaticDataCollectionEnabled(true);
        should.equal(firebase.inAppMessaging().isAutomaticDataCollectionEnabled, true);
      });

      it('false', async function () {
        await firebase.inAppMessaging().setAutomaticDataCollectionEnabled(false);
        should.equal(firebase.inAppMessaging().isAutomaticDataCollectionEnabled, false);
      });

      it('errors if not boolean', async function () {
        try {
          firebase.inAppMessaging().setAutomaticDataCollectionEnabled();
          return Promise.reject(new Error('Did not throw'));
        } catch (e) {
          e.message.should.containEql('must be a boolean');
          return Promise.resolve();
        }
      });
    });

    xdescribe('setMessagesDisplaySuppressed()', function () {
      it('false', async function () {
        should.equal(firebase.inAppMessaging().isMessagesDisplaySuppressed, false);
        await firebase.inAppMessaging().setMessagesDisplaySuppressed(false);
        should.equal(firebase.inAppMessaging().isMessagesDisplaySuppressed, false);
        await Utils.sleep(2000);
      });

      it('true', async function () {
        await device.launchApp();
        await firebase.inAppMessaging().setMessagesDisplaySuppressed(true);
        should.equal(firebase.inAppMessaging().isMessagesDisplaySuppressed, true);
        await Utils.sleep(1500);
        await firebase.inAppMessaging().setMessagesDisplaySuppressed(false);
        should.equal(firebase.inAppMessaging().isMessagesDisplaySuppressed, false);
        await Utils.sleep(1500);
      });

      it('errors if not boolean', async function () {
        try {
          firebase.inAppMessaging().setMessagesDisplaySuppressed();
          return Promise.reject(new Error('Did not throw'));
        } catch (e) {
          e.message.should.containEql('must be a boolean');
          return Promise.resolve();
        }
      });
    });

    xdescribe('triggerEvent()', function () {
      it('no exceptions thrown', async function () {
        await device.launchApp();
        await firebase.inAppMessaging().triggerEvent('eventName');
      });
    });
  });

  describe('modular', function () {
    describe('setAutomaticDataCollectionEnabled()', function () {
      // These depend on `tests/firebase.json` having `in_app_messaging_auto_collection_enabled` set to false the first time
      // The setting is persisted across restarts, reset to false after for local runs where prefs are sticky
      afterEach(async function () {
        await firebase.inAppMessaging().setAutomaticDataCollectionEnabled(false);
      });
      // afterEach(async function () {
      //   const { getInAppMessaging, setAutomaticDataCollectionEnabled } = inAppMessagingModular;
      //   const inAppMessaging = getInAppMessaging();
      //   await setAutomaticDataCollectionEnabled(inAppMessaging, false);
      // });

      it('true', async function () {
        const {
          getInAppMessaging,
          setAutomaticDataCollectionEnabled,
          isAutomaticDataCollectionEnabled,
        } = inAppMessagingModular;
        const inAppMessaging = getInAppMessaging();

        should.equal(isAutomaticDataCollectionEnabled(inAppMessaging), false);
        await setAutomaticDataCollectionEnabled(inAppMessaging, true);
        should.equal(isAutomaticDataCollectionEnabled(inAppMessaging), true);
      });

      it('false', async function () {
        const {
          getInAppMessaging,
          setAutomaticDataCollectionEnabled,
          isAutomaticDataCollectionEnabled,
        } = inAppMessagingModular;
        const inAppMessaging = getInAppMessaging();

        await setAutomaticDataCollectionEnabled(inAppMessaging, false);
        should.equal(isAutomaticDataCollectionEnabled(inAppMessaging), false);
      });

      it('errors if not boolean', async function () {
        const { getInAppMessaging, setAutomaticDataCollectionEnabled } = inAppMessagingModular;

        try {
          await setAutomaticDataCollectionEnabled(getInAppMessaging());
          return Promise.reject(new Error('Did not throw'));
        } catch (e) {
          e.message.should.containEql('must be a boolean');
          return Promise.resolve();
        }
      });
    });

    xdescribe('setMessagesDisplaySuppressed()', function () {
      it('false', async function () {
        const { getInAppMessaging, setMessagesDisplaySuppressed, isMessagesDisplaySuppressed } =
          inAppMessagingModular;
        const inAppMessaging = getInAppMessaging();

        should.equal(isMessagesDisplaySuppressed(inAppMessaging), false);
        await setMessagesDisplaySuppressed(inAppMessaging, false);
        should.equal(isMessagesDisplaySuppressed(inAppMessaging), false);
        await Utils.sleep(2000);
      });

      it('true', async function () {
        const { getInAppMessaging, setMessagesDisplaySuppressed, isMessagesDisplaySuppressed } =
          inAppMessagingModular;
        const inAppMessaging = getInAppMessaging();

        await device.launchApp();
        await setMessagesDisplaySuppressed(inAppMessaging, true);
        should.equal(isMessagesDisplaySuppressed(inAppMessaging), true);
        await Utils.sleep(1500);
        await setMessagesDisplaySuppressed(inAppMessaging, false);
        should.equal(isMessagesDisplaySuppressed(inAppMessaging), false);
        await Utils.sleep(1500);
      });

      it('errors if not boolean', async function () {
        const { setMessagesDisplaySuppressed } = inAppMessagingModular;

        try {
          setMessagesDisplaySuppressed();
          return Promise.reject(new Error('Did not throw'));
        } catch (e) {
          e.message.should.containEql('must be a boolean');
          return Promise.resolve();
        }
      });
    });

    xdescribe('triggerEvent()', function () {
      it('no exceptions thrown', async function () {
        const { getInAppMessaging, triggerEvent } = inAppMessagingModular;
        const inAppMessaging = getInAppMessaging();

        await device.launchApp();
        await triggerEvent(inAppMessaging, 'eventName');
      });
    });
  });
});

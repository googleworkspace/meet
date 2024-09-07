# Meet Addons Web SDK

Embed your app in Google Meet as an Add-on.

You can view the official documentation for add-ons
[here](https://developers.google.com/meet/add-ons/guides/overview).

## Where's the source code?

Unfortunately, the code has some dependencies on Google proprietary libraries
that mean we can't open source it at this time.

## Usage

First, install the package:

```bash
npm install @googleworkspace/meet-addons
```

For TypeScript users, TypeScript definitions are packaged with the module. There
is no need to install any modules from DefinitelyTyped. Also ensure that you use
a ModuleResolution strategy in your `tsconfig.json` that [supports package.json 
`exports`](https://www.typescriptlang.org/tsconfig/#moduleResolution) (likely
you want to use one of 'node16', 'nodenext' or 'bundler').

### Creating an add-on session

```typescript
import {meet} from '@googleworkspace/meet-addons/meet.addons';
...
await meet.addon.createAddonSession({
  // TODO: Replace the Cloud project number.
  cloudProjectNumber: "YOUR_CLOUD_PROJECT_NUMBER"
});
```

For more detail, see the developer guide on
[creating a side panel page](https://developers.google.com/meet/add-ons/guides/use-SDK#side-panel).

### Promoting an add-on through screen sharing

```typescript
import {
  meet as meetScreenshare
} from '@googleworkspace/meet-addons/meet.addons.screenshare';
...
meetScreenshare.addon.screensharing.exposeToMeetWhenScreensharing({
  // TODO: Replace the Cloud project number.
  cloudProjectNumber: "YOUR_CLOUD_PROJECT_NUMBER",
  startActivityOnOpen: true,
  // Replace this with the URL to the site to iframe in the main stage.
  mainStageUrl: "MAIN_STAGE_URL",
});
```

For more detail, see the developer guide on
[promoting an add-on through screen sharing](https://developers.google.com/meet/add-ons/guides/screen-sharing).

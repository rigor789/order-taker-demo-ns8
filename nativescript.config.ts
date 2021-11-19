import { NativeScriptConfig } from "@nativescript/core";

export default {
  id: "org.nativescript.blankng",
  appPath: "app",
  appResourcesPath: "App_Resources",
  android: {
    v8Flags: "--expose_gc",
    markingMode: "none",
    forceLog: true,
  },
} as NativeScriptConfig;

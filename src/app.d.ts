// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { IStaticMethods } from "flyonui/flyonui";

declare global {
  interface Window {
    // Optional plugins
    _;
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
    DataTable;
    Dropzone;

    // FlyonUI
    HSStaticMethods: IStaticMethods;
  }

  namespace App {

  }
}

export {};
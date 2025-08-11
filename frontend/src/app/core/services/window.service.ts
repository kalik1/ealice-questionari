import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';

interface WindowObj {
    scroll: (x: number, y: number) => void;
}

class FakeWindow implements WindowObj {
    scroll(x: number, y: number): void  {
        console.log(`fake scroll to y:${y}, x:${x}`);
    }
}

/* Create a new injection token for injecting the window into a component. */
export const WINDOW = new InjectionToken('WindowToken');

/* Define abstract class for obtaining reference to the global window object. */
export abstract class WindowRef {

    get nativeWindow(): Window | WindowObj {
        throw new Error('Not implemented.');
    }
}

/* Define class that implements the abstract class and returns the native window object. */
export class BrowserWindowRef extends WindowRef {

    constructor() {
        super();
    }

    get nativeWindow(): Window | WindowObj {
        return window;
    }

}

/* Create an factory function that returns the native window object. */
const windowFactory = (browserWindowRef: BrowserWindowRef, platformId: any): Window | WindowObj => {
    if (isPlatformBrowser(platformId)) {
        return browserWindowRef.nativeWindow;
    }
    return new FakeWindow();
};

/* Create a injectable provider for the WindowRef token that uses the BrowserWindowRef class. */
const browserWindowProvider: ClassProvider = {
    provide: WindowRef,
    useClass: BrowserWindowRef
};

/* Create an injectable provider that uses the windowFactory function for returning the native window object. */
const windowProvider: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [ WindowRef, PLATFORM_ID ]
};

/* Create an array of providers. */
export const WINDOW_PROVIDERS = [
    browserWindowProvider,
    windowProvider
];

export {windowFactory};
